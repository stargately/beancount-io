/**
 * Configuration for journal screen column widths
 */

export interface JournalFieldWidth {
  /** Width of the field (number for fixed width, "flex" for flexible) */
  width: number | "flex";
}

/**
 * Journal field width configurations
 * Defines the column widths displayed in the journal screen
 */
export const JOURNAL_FIELD_WIDTHS: Record<string, JournalFieldWidth> = {
  date: {
    width: 100,
  },
  flag: {
    width: 80,
  },
  description: {
    width: "flex",
  },
};

/**
 * Get field width configuration by field ID
 */
export const getFieldWidth = (fieldId: string): number | "flex" => {
  return JOURNAL_FIELD_WIDTHS[fieldId]?.width ?? "flex";
};
