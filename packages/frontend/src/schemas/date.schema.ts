import { z } from "zod";

export const DateSchema = z.coerce.date();
