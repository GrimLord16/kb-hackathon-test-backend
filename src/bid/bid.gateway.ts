import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayInit, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateBidDto } from './dtos/create-bid.dto';
import { BidService } from './bid.service';
import { JwtUser, verifyJwt } from 'src/lib/jwt';

type CreateBidQuery = {
  auction?: string;
  auth_token?: string;
};

declare module 'socket.io' {
  export interface Socket {
    user: JwtUser; 
  }
}

@WebSocketGateway({ cors: '*:*' })
export class BidGateway implements OnGatewayInit {
  constructor(private readonly bidService: BidService) {}

  @WebSocketServer() 
  server: Server;
  
  async afterInit(server: Server) {
    server.on('connection', async (socket: Socket) => {
      const query = socket.handshake.query as CreateBidQuery;

      if (!query.auth_token) {
        console.log('No token found in request');
        socket.emit('error', 'No token found in request');
        socket.disconnect();
        return;
      }

      try {
        const payload = verifyJwt(query.auth_token);
        // TODO: It's probably better to store socket id in the user db object
        socket.user = payload.user;
      } catch (error) {
        console.error('Token validation failed', error);
        socket.disconnect();
        return;
      }

      socket.join(query.auction ?? 'default');
      console.log("Connected successfully and joined room: " + query.auction + " with user: " + socket.user.email + " and id: " + socket.id);
      socket.emit('connected', socket.id);
    });

    server.on('disconnect', (socket: Socket) => {
      console.log(socket.id + ' disconnected');
    });
  }
  
  @SubscribeMessage('createBid')
  async handleMessage(@MessageBody() bid: CreateBidDto, @ConnectedSocket() socket: Socket) {
    const user = socket.user;
    console.log('Got \"createBid\" message from user: ' + user.email);
    console.log('Message: ', bid);
    const newBid = await this.bidService.create(bid, user.id);
    this.server.to([bid.auction, 'default']).emit('newBid', newBid)
    return true;
  }
}