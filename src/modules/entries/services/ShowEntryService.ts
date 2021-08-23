import { classToClass } from "class-transformer";
import { inject, injectable } from "tsyringe";
import IEntriesRepository from "../repositories/IEntriesRepository";
import Entry from "../infra/typeorm/entities/Entry";
import AppError from "@shared/errors/AppError";

@injectable()
class ListEntriesByMonthService {
  constructor(
    @inject("EntriesRepository")
    private entriesRepository: IEntriesRepository
  ) {}

  public async execute(id: string): Promise<Entry> {
    const entry = await this.entriesRepository.findById(id);

    if (!entry) throw new AppError("Lancamento nao encontrado", 400);

    return classToClass(entry);
  }
}

export default ListEntriesByMonthService;
