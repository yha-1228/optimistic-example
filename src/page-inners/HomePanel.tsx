"use client";

import type { ChangeEvent } from "react";
import { useState } from "react";

import {
  useRouter,
  useSearchParams,
  type ReadonlyURLSearchParams,
} from "next/navigation";
import { CommentListStable as CommentListEasyStable } from "@/components/easy/CommentListStable";
import { CommentListUseOptimistic as CommentListEasyUseOptimistic } from "@/components/easy/CommentListUseOptimistic";
import { CommentListStable } from "@/components/normal/CommentListStable";
import { CommentListUseOptimistic } from "@/components/normal/CommentListUseOptimistic";

type Type = "easy-stable" | "easy-use-optimistic" | "stable" | "use-optimistic";

const queryToFormInput = (searchParams: ReadonlyURLSearchParams): Type | "" => {
  if (searchParams.get("type")) {
    return searchParams.get("type") as Type;
  } else {
    return "";
  }
};

const formInputToQueryString = (
  type: Type,
  currentSearchParams: ReadonlyURLSearchParams,
) => {
  const params = new URLSearchParams(currentSearchParams.toString());
  params.set("type", type);

  return params.toString();
};

const typeOptions: Record<Type, string> = {
  "easy-stable": "Easy Stable",
  "easy-use-optimistic": "Easy useOptimistic",
  stable: "Stable",
  "use-optimistic": "useOptimistic",
};

// ----------------------------------------

export function HomePanel() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [type, setType] = useState<Type | "">(queryToFormInput(searchParams));

  const handleTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const nextType = e.target.value as Type;
    setType(nextType);

    const queryString = formInputToQueryString(nextType, searchParams);
    router.push(`/?${queryString}`);
  };

  return (
    <div>
      <fieldset>
        <legend>Type</legend>
        {Object.entries(typeOptions).map(([value, label]) => (
          <label key={value}>
            <input
              name="type"
              type="radio"
              value={value}
              checked={type === value}
              onChange={handleTypeChange}
            />
            {label}
          </label>
        ))}
      </fieldset>

      <hr />
      {type === "easy-stable" && <CommentListEasyStable />}
      {type === "easy-use-optimistic" && <CommentListEasyUseOptimistic />}
      {type === "stable" && <CommentListStable />}
      {type === "use-optimistic" && <CommentListUseOptimistic />}
    </div>
  );
}
