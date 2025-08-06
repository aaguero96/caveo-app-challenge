export interface IRepository<T> {
  create(): Promise<T>;
  findOne(): Promise<T>;
  find(): Promise<T>;
  update(): Promise<void>;
}
