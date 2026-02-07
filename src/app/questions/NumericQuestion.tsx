// src/questions/NumericQuestion.tsx
import { z } from "zod";
import { FieldError } from "react-hook-form";
import { Question, QuestionRenderProps } from "../types/quiz";

export function createNumericQuestion(
    id: string,
    prompt: string,
    min: number,
    max: number
): Question {
    return {
        id,
        type: "numeric",
        prompt,
        schema: z.object({
            [id]: z
                .number("Must be a number")
                .min(min, `Must be ≥ ${min}`)
                .max(max, `Must be ≤ ${max}`),
        }),
        render: ({ register, errors, name }: QuestionRenderProps) => (
            <div className="space-y-2">
                <p className="font-semibold">{prompt}</p>
                <input
                    type="number"
                    {...register(name, { valueAsNumber: true })}
                    className="border px-2 py-1 rounded"
                />
                {errors[name] && (
                    <span className="text-red-500 text-sm">{(errors[name] as FieldError)?.message}</span>
                )}
            </div>
        ),
    };
}
