import { Request, Response } from "express";
import { container } from "tsyringe";
import ListEntriesByMonthService from "@modules/entries/services/ListEntriesByMonthService";
import CreateEntryService from "@modules/entries/services/CreateEntryService";

export default class EntriesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { month, year } = request.query;

    const listEntriesByMonth = container.resolve(ListEntriesByMonthService);

    const entries = await listEntriesByMonth.execute({
      user_id,
      month: Number(month),
      year: Number(year),
    });

    return response.json(entries);
  }

  public async insert(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { category_id, description, amount, property, date } = request.body;

    const createEntry = container.resolve(CreateEntryService);

    const entry = await createEntry.execute({
      user_id,
      category_id,
      description,
      amount,
      property,
      date,
    });

    return response.json(entry);
  }
}
