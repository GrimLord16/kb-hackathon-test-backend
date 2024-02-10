export class CreateAuctionDto {
  readonly product: {
    name: string;
    category: string;
    pictureUrl?: string;
  };

  readonly charity?: boolean;

  readonly currency: string;
  // Add any other fields you require for creating an auction
}
