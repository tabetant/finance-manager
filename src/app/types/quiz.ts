// src/types/quiz.ts
import React from "react";
import { ZodSchema } from "zod";

export interface Question {
    id: string;
    type: string; // "multiple-choice" | "numeric" | etc
    prompt: string;
    schema: ZodSchema<any>;   // validation schema for this question
    render: (props: QuestionRenderProps) => React.ReactElement;
}

export interface QuestionRenderProps {
    register: any; // from react-hook-form
    errors: any;
    name: string;
}
