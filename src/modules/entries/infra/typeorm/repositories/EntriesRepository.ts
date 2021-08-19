import { Between, getRepository, Repository } from "typeorm";
import IEntriesRepository from "@modules/entries/repositories/IEntriesRepository";
import ICreateEntryDTO from "@modules/entries/dtos/ICreateEntryDTO";
import IFindEntriesByBeteweenDatesDTO from "@modules/entries/dtos/IFindEntriesByBeteweenDatesDTO";
import Entry from "../entities/Entry";

class EntriesRepository implements IEntriesRepository {
  private ormRepository: Repository<Entry>;

  constructor() {
    this.ormRepository = getRepository(Entry);
  }

  public async create({
    user_id,
    category_id,
    description,
    amount,
    property,
    date,
  }: ICreateEntryDTO): Promise<Entry> {
    const entry = this.ormRepository.create({
      user_id,
      category_id,
      description,
      amount,
      property,
      date,
    });

    await this.save(entry);

    return entry;
  }

  public async findById(entry_id: string): Promise<Entry | undefined> {
    const entry = await this.ormRepository.findOne(entry_id);

    return entry;
  }

  public async findByBetweenDates({
    user_id,
    initial,
    final,
  }: IFindEntriesByBeteweenDatesDTO): Promise<Entry[]> {
    console.log(initial, final);

    const entries = await this.ormRepository.find({
      where: {
        user_id,
        date: Between(initial, final),
      },
      relations: ["category"],
    });

    return entries;
  }

  public async save(entry: Entry): Promise<Entry> {
    return this.ormRepository.save(entry);
  }
}

export default EntriesRepository;
