import { inject, injectable } from "tsyringe";
import IEntriesRepository from "../repositories/IEntriesRepository";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import Entry from "../infra/typeorm/entities/Entry";
import ICreateEntryDTO from "../dtos/ICreateEntryDTO";
import { addHours } from "date-fns";

@injectable()
class CreateEntryService {
  constructor(
    @inject("EntriesRepository")
    private entriesRepository: IEntriesRepository,
    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({
    user_id,
    category_id,
    description,
    amount,
    property,
    date,
  }: ICreateEntryDTO): Promise<Entry> {
    const entry = await this.entriesRepository.create({
      user_id,
      category_id,
      description,
      amount,
      property,
      date: addHours(date, 12),
    });

    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth();

    await this.cacheProvider.invalidate(
      `list-entries:${user_id}:${year}-${month}`
    );

    return entry;
  }
}

export default CreateEntryService;
