import { Request, Response } from "express";
import { container } from "tsyringe";
import ListEntriesByMonthService from "@modules/entries/services/ListEntriesByMonthService";
import CreateEntryService from "@modules/entries/services/CreateEntryService";
import ShowEntryService from "@modules/entries/services/ShowEntryService";
import UpdateEntryService from "@modules/entries/services/UpdateEntryService";
import DeleteEntryService from "@modules/entries/services/DeleteEntryService";

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

  public async show(request: Request, response: Response): Promise<Response> {
    const { entry_id } = request.params;

    const showEntryService = container.resolve(ShowEntryService);

    const entries = await showEntryService.execute(entry_id);

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

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { entry_id } = request.params;
    const { category_id, description, amount, property, date } = request.body;

    const updateEntry = container.resolve(UpdateEntryService);

    const entry = await updateEntry.execute({
      entry_id,
      user_id,
      category_id,
      description,
      amount,
      property,
      date,
    });

    return response.json(entry);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { entry_id } = request.params;

    const deleteEntryService = container.resolve(DeleteEntryService);

    const entries = await deleteEntryService.execute({ user_id, entry_id });

    return response.json(entries);
  }
}
