export class Product {
  constructor(
    public product_id: number,
    public title: string,
    public rating: string, // đánh giá tính theo sao
    public sold: number, // số lượng sách đã bán
    public price: number,
    public publisher: string, // nhà xuất bản
    public author: string,
    public cover_type: string, // loại bìa sách
    public description: string,
    public image: string,
  ) {}
}
