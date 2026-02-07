// src/types/quiz.ts
import React from "react";
import { ZodSchema } from "zod";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

export interface QuestionRenderProps {
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
    name: string;
}

export interface Question {
    id: string;
    type: string; // "multiple-choice" | "numeric" | etc
    prompt: string;
    schema: ZodSchema<unknown>;   // validation schema for this question
    render: (props: QuestionRenderProps) => React.ReactElement;
}
