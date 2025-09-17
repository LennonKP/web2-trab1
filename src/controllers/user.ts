import { Request, Response } from "express";
import { UserService } from "../services/userService";

export class UserController {
  constructor(private userService: UserService) { }

  getAll = (req: Request, res: Response): void => {
    let page = req.query.page ? parseInt(req.query.page as string) : 1;
    if (isNaN(page) || page < 1) page = 1;
    const filters = {
      name: req.query.name as string | undefined,
      role: req.query.role as string | undefined,
      status: req.query.status as string | undefined,
      date: req.query.date as string | undefined
    }

    const usersData = this.userService.getUsers({ pagination: page, limit: 4, filters });

    res.render("index", {
      title: "Home",
      usersData,
      filters,
      success_message: req.flash('success_message'),
      error_message: req.flash('error_message')
    });
  };

  getForm = (req: Request, res: Response): void => {
    const id = req.params.id ? parseInt(req.params.id) : null;
    if (!id) {
      return res.render("user-form", {
        title: "User Form",
        previousBody: {},
        currentId: null,
        error_message: ""
      });
    }
    try {
      const user = this.userService.getUserById(id);
      return res.render("user-form", {
        title: "User Form",
        previousBody: user,
        currentId: id,
        error_message: req.flash('error_message') ?? ""
      });
    } catch (error: Error | any) {
      req.flash('error_message', "User not found");
      return res.redirect("/");
    }
  };

  create = (req: Request, res: Response): void => {
    try {
      this.userService.createUser(req.body);
      req.flash('success_message', 'Usuário criado com successo');
      res.redirect("/");
    } catch (error: Error | any) {
      return res.render("user-form", {
        title: "User Form",
        previousBody: req.body,
        error_message: error.message
      });
    }
  };

  update = (req: Request, res: Response): void => {
    const id = req.params.id ? parseInt(req.params.id) : null;
    if (!id) {
      req.flash('error_message', "User not found");
      return res.redirect("/");
    }
    try {
      this.userService.updateUser(id, req.body);
      req.flash('success_message', 'Usuário atualizado com successo');
      res.redirect("/");
    } catch (error: Error | any) {
      return res.render("user-form", {
        title: "User Form",
        currentId: id,
        previousBody: req.body,
        error_message: error.message
      });
    }
  }

  delete = (req: Request, res: Response): void => {
    try {
      this.userService.deleteUser(parseInt(req.params.id));
      req.flash('success_message', 'Usuário deletado com successo');
      res.redirect("/");
    } catch (error: Error | any) {
      req.flash('error_message', error.message);
      res.redirect("/");
    }
  };

  exportCsv = (_req: Request, res: Response): void => {
    const csv = this.userService.toCsv();
    res.header("Content-Type", "text/csv");
    res.attachment("users.csv");
    res.send(csv);
  }
}
