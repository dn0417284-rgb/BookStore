export class Product {
  constructor(
    public product_id: number,
    public title: string,
    public rating: string,
    public sold: number,
    public price: number,
    public publisher: string,
    public author: string,
    public cover_type: string,
    public description: string,
    public image: string,
    public stock: number
  ) {}
}
