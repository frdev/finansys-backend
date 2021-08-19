export default interface ICreateEntryDTO {
  user_id: string;
  category_id: string;
  description: string;
  amount: number;
  property: "expense" | "revenue";
  date: Date;
}
