import ICreateEntryDTO from "../dtos/ICreateEntryDTO";
import IFindEntriesByBeteweenDatesDTO from "../dtos/IFindEntriesByBeteweenDatesDTO";
import Entry from "../infra/typeorm/entities/Entry";

export default interface IEntriesRepository {
  findById(entry_id: string): Promise<Entry | undefined>;
  findByBetweenDates(data: IFindEntriesByBeteweenDatesDTO): Promise<Entry[]>;
  create(date: ICreateEntryDTO): Promise<Entry>;
  save(entry: Entry): Promise<Entry>;
}
