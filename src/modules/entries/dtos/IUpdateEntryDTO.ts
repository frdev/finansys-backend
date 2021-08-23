export default interface IUpdateEntryDTO {
  entry_id: string;
  user_id: string;
  category_id: string;
  description: string;
  amount: number;
  property: "expense" | "revenue";
  date: Date;
}
