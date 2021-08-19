import { inject, injectable } from "tsyringe";
import IEntriesRepository from "../repositories/IEntriesRepository";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import Entry from "../infra/typeorm/entities/Entry";
import ICreateEntryDTO from "../dtos/ICreateEntryDTO";

interface IRequest {
  user_id: string;
  month: number;
  year: number;
}

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
      date,
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
