export class UpdateAuctionDto {
  readonly product?: {
    name?: string;
    category?: string;
    pictureUrl?: string;
  };

  readonly charity?: boolean;
  readonly currency?: string;
  // Add any other fields as optional for updating an auction
}
