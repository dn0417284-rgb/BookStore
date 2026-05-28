export class Customer {
  constructor(
    public customer_id: number,
    public full_name: string,
    public password: string,
    public email: string,
    public phone: string,
    public address: string,
    public warning_count: number,
    public account_status: boolean,
  ) {}
}
