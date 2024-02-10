import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayInit, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateBidDto } from './dtos/create-bid.dto';
import { BidService } from './bid.service';

type CreateBidQuery = {
  auction: string;
};

@WebSocketGateway({ cors: '*:*' })
export class BidGateway implements OnGatewayInit {
  constructor(private readonly bidService: BidService) {}

  @WebSocketServer() 
  server: Server;
  
  async afterInit(server: Server) {
    server.on('connection', async (socket: Socket) => {
      const query = socket.handshake.query as CreateBidQuery;
      socket.join(query.auction);
      console.log("Connected successfully");
      socket.emit('connected', socket.id);
    });

    server.on('disconnect', (socket: Socket) => {
      console.log(socket.id + ' disconnected');
    });
  }
  
  @SubscribeMessage('createBid')
  async handleMessage(@MessageBody() bid: CreateBidDto) {
    console.log('Message: ', bid);
    this.server.to(bid.auction).emit('newBid', await this.bidService.create(bid));
  }
}