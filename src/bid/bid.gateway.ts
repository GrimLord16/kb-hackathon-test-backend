import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayInit, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateBidDto } from './dtos/create-bid.dto';
import { BidService } from './bid.service';



@WebSocketGateway({ cors: '*:*' })
export class BidGateway implements OnGatewayInit {
    constructor(private readonly bidService: BidService) {}

    @WebSocketServer() 
    server: Server;
    
    async afterInit(server: Server) {
        server.on('connection', async (socket: Socket) => {
          console.log("Connected successfully");
          socket.emit('connected', socket.id);
        });
    
        server.on('disconnect', (socket: Socket) => {
          console.log(socket.id + ' disconnected');
        });
    }
    
    @SubscribeMessage('createBid')
    handleMessage(@MessageBody() bid: CreateBidDto) {
        console.log('Message: ', bid);
        this.server.emit('message', this.bidService.create(bid));
    }
}