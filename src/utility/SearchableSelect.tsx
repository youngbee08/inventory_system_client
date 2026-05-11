import { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";
import api, { getErrorMessage } from "../helpers/api";

export interface SearchableSelectOption<TRecord = unknown> {
  value: string;
  label: string;
  description?: string;
  meta?: string;
  record?: TRecord;
}

interface SearchableSelectProps<TRecord = unknown> {
  label: string;
  value: string;
  onChange: (value: string, option?: SearchableSelectOption<TRecord>) => void;
  placeholder?: string;
  endpoint?: string;
  responseKey?: string;
  disabled?: boolean;
  searchPlaceholder?: string;
  mapOption?: (record: TRecord) => SearchableSelectOption<TRecord>;
}

const defaultMapOption = <TRecord,>(
  record: TRecord,
): SearchableSelectOption<TRecord> => {
  const optionRecord = record as {
    _id: string;
    name?: string;
    email?: string;
    title?: string;
  };

  return {
    value: optionRecord._id,
    label: optionRecord.name ?? optionRecord.title ?? optionRecord._id,
    description: optionRecord.email,
    record,
  };
};

const SearchableSelect = <TRecord,>({
  label,
  value,
  onChange,
  placeholder = "Select option",
  endpoint = "/auth/employees",
  responseKey = "employees",
  disabled = false,
  searchPlaceholder = "Search options",
  mapOption,
}: SearchableSelectProps<TRecord>) => {
  const [options, setOptions] = useState<SearchableSelectOption<TRecord>[]>([]);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return options;

    return options.filter((option) => {
      return `${option.label} ${option.description ?? ""} ${option.meta ?? ""}`
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [options, query]);

  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await api.get(endpoint);
        const records = (res.data?.[responseKey] ?? []) as TRecord[];
        const mappedOptions = records.map((record) =>
          mapOption ? mapOption(record) : defaultMapOption(record),
        );

        setOptions(mappedOptions);
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to load options"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchOptions();
  }, [endpoint, mapOption, responseKey]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="mb-2 block text-xs font-bold text-tableHeading">
        {label}
      </label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-10 w-full items-center justify-between gap-3 rounded-md border border-tableBorder bg-white px-4 text-left text-xs text-tableHeading shadow-sm shadow-primary/5 outline-0 transition hover:border-primary/20 focus:border-primary/40 focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className={selectedOption ? "truncate" : "truncate text-tableData"}>
          {selectedOption?.label ?? placeholder}
        </span>
        <FiChevronDown
          size={16}
          className={`shrink-0 text-fadedBlack transition ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-md border border-tableBorder bg-white shadow-xl shadow-primary/10">
          <label className="flex h-10 items-center gap-2 border-b border-tableBorder px-3">
            <FiSearch size={15} className="text-fadedBlack" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-full w-full border-0 bg-transparent text-xs text-tableHeading outline-0 placeholder:text-fadedBlack"
              placeholder={searchPlaceholder}
              autoComplete="off"
            />
          </label>

          <div className="max-h-56 overflow-y-auto p-1 styled-scrollbar">
            {isLoading ? (
              <div className="space-y-2 p-2">
                {[0, 1, 2].map((item) => (
                  <div
                    key={item}
                    className="h-9 animate-pulse rounded-md bg-outlineBlack/70"
                  />
                ))}
              </div>
            ) : error ? (
              <p className="px-3 py-3 text-xs font-medium text-red-600">
                {error}
              </p>
            ) : filteredOptions.length === 0 ? (
              <p className="px-3 py-3 text-xs font-medium text-tableData">
                No options found.
              </p>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value, option);
                    setIsOpen(false);
                    setQuery("");
                  }}
                  className={`w-full rounded-md px-3 py-2 text-left transition hover:bg-tetiary ${
                    option.value === value ? "bg-tetiary" : ""
                  }`}
                >
                  <span className="block text-xs font-bold text-tableHeading">
                    {option.label}
                  </span>
                  {option.description && (
                    <span className="mt-0.5 block text-[11px] text-tableData">
                      {option.description}
                    </span>
                  )}
                  {option.meta && (
                    <span className="mt-0.5 block text-[11px] font-medium text-primary">
                      {option.meta}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
