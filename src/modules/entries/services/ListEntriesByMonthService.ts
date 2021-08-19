import { classToClass } from "class-transformer";
import { getDate, lastDayOfMonth } from "date-fns";
import { inject, injectable } from "tsyringe";
import IEntriesRepository from "../repositories/IEntriesRepository";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import Entry from "../infra/typeorm/entities/Entry";

interface IRequest {
  user_id: string;
  month: number;
  year: number;
}

@injectable()
class ListEntriesByMonthService {
  constructor(
    @inject("EntriesRepository")
    private entriesRepository: IEntriesRepository,
    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({ user_id, month, year }: IRequest): Promise<Entry[]> {
    const keyCache = `list-entries:${user_id}:${year}-${month}`;

    let entries = await this.cacheProvider.recover<Entry[]>(keyCache);

    if (!entries) {
      const initial = new Date(year, month, 1, 0, 0, 0);
      const final = new Date(
        year,
        month,
        getDate(lastDayOfMonth(initial)),
        23,
        59,
        59,
        59
      );

      entries = await this.entriesRepository.findByBetweenDates({
        user_id,
        initial,
        final,
      });

      entries = classToClass(entries);

      await this.cacheProvider.save(keyCache, entries);
    }

    return entries;
  }
}

export default ListEntriesByMonthService;
