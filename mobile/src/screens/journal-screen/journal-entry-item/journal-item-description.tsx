import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useThemeStyle } from "@/common/hooks";
import { useTranslations } from "@/common/hooks/use-translations";
import { ColorTheme } from "@/types/theme-props";
import {
  type JournalDirectiveType,
  type JournalTransaction,
  type JournalBalance,
  type JournalClose,
  type JournalCustom,
  type JournalDocument,
  type JournalEvent,
  type JournalNote,
  type JournalOpen,
  type JournalPad,
  type JournalPrice,
  isJournalTransaction,
  isJournalBalance,
  isJournalClose,
  isJournalCustom,
  isJournalDocument,
  isJournalEvent,
  isJournalNote,
  isJournalOpen,
  isJournalPad,
  isJournalPrice,
} from "../types";

const getStyles = (theme: ColorTheme) =>
  StyleSheet.create({
    descriptionCell: {
      flex: 1,
      marginLeft: 8,
    },
    payeeText: {
      fontWeight: "600",
      fontSize: 14,
      color: theme.black90,
    },
    narrationText: {
      fontSize: 14,
      color: theme.black90,
    },
    accountText: {
      fontFamily: "monospace",
      fontSize: 14,
      color: theme.black90,
    },
    filenameText: {
      fontSize: 14,
      color: theme.black80,
    },
    commentText: {
      fontSize: 14,
      color: theme.black90,
    },
    typeText: {
      fontWeight: "500",
      fontSize: 14,
      color: theme.black90,
    },
    mutedText: {
      fontSize: 12,
      color: theme.black60,
      marginTop: 2,
    },
    tagText: {
      fontSize: 12,
      color: theme.information,
    },
    linkText: {
      fontSize: 12,
      color: theme.information,
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 4,
      gap: 4,
    },
  });

/**
 * Formats an amount for display
 */
const formatAmount = (amount: { number: string; currency: string }) => {
  return `${amount.number} ${amount.currency}`;
};

/**
 * Renders description for a Transaction directive
 */
const renderTransactionDescription = (
  directive: JournalTransaction,
  styles: ReturnType<typeof getStyles>,
) => (
  <View style={styles.descriptionCell}>
    <View
      style={{
        flexDirection: "column",
        alignItems: "flex-start",
        flexWrap: "wrap",
      }}
    >
      {directive.payee && (
        <Text style={styles.payeeText}>{directive.payee}</Text>
      )}
      {directive.narration && (
        <Text style={styles.narrationText}>{directive.narration}</Text>
      )}
    </View>
    {(directive.tags?.length > 0 || directive.links?.length > 0) && (
      <View style={styles.tagsContainer}>
        {directive.tags.map((tag) => (
          <Text key={tag} style={styles.tagText}>
            #{tag}{" "}
          </Text>
        ))}
        {directive.links.map((link) => (
          <Text key={link} style={styles.linkText}>
            ^{link}{" "}
          </Text>
        ))}
      </View>
    )}
  </View>
);

/**
 * Renders description for a Balance directive
 */
const renderBalanceDescription = (
  directive: JournalBalance,
  styles: ReturnType<typeof getStyles>,
) => (
  <View style={styles.descriptionCell}>
    <Text style={styles.accountText}>{directive.account}</Text>
    {directive.diff_amount && (
      <Text style={styles.mutedText}>
        accumulated {formatAmount(directive.diff_amount)}
      </Text>
    )}
  </View>
);

/**
 * Renders description for a Document directive
 */
const renderDocumentDescription = (
  directive: JournalDocument,
  styles: ReturnType<typeof getStyles>,
) => (
  <View style={styles.descriptionCell}>
    <Text style={styles.accountText}>{directive.account}</Text>
    <Text style={styles.filenameText}>
      {directive.filename.split("/").pop()}
    </Text>
    {(directive.tags.length > 0 || directive.links.length > 0) && (
      <View style={styles.tagsContainer}>
        {directive.tags.map((tag) => (
          <Text key={tag} style={styles.tagText}>
            #{tag}{" "}
          </Text>
        ))}
        {directive.links.map((link) => (
          <Text key={link} style={styles.linkText}>
            ^{link}{" "}
          </Text>
        ))}
      </View>
    )}
  </View>
);

/**
 * Renders description for an Open directive
 */
const renderOpenDescription = (
  directive: JournalOpen,
  styles: ReturnType<typeof getStyles>,
) => (
  <View style={styles.descriptionCell}>
    <Text style={styles.accountText}>{directive.account}</Text>
  </View>
);

/**
 * Renders description for a Close directive
 */
const renderCloseDescription = (
  directive: JournalClose,
  styles: ReturnType<typeof getStyles>,
) => (
  <View style={styles.descriptionCell}>
    <Text style={styles.accountText}>{directive.account}</Text>
  </View>
);

/**
 * Renders description for a Note directive
 */
const renderNoteDescription = (
  directive: JournalNote,
  styles: ReturnType<typeof getStyles>,
) => (
  <View style={styles.descriptionCell}>
    <Text style={styles.commentText}>{directive.comment}</Text>
  </View>
);

/**
 * Renders description for a Pad directive
 */
const renderPadDescription = (
  directive: JournalPad,
  styles: ReturnType<typeof getStyles>,
) => (
  <View style={styles.descriptionCell}>
    <Text style={styles.accountText}>{directive.account}</Text>
    <Text style={styles.mutedText}>from {directive.source_account}</Text>
  </View>
);

/**
 * Renders description for a Custom directive
 */
const renderCustomDescription = (
  directive: JournalCustom,
  styles: ReturnType<typeof getStyles>,
) => (
  <View style={styles.descriptionCell}>
    <Text style={styles.typeText}>{directive.type}</Text>
    <Text style={styles.mutedText}>{directive.values.length} values</Text>
  </View>
);

/**
 * Renders description for an Event directive
 */
const renderEventDescription = (
  directive: JournalEvent,
  styles: ReturnType<typeof getStyles>,
) => (
  <View style={styles.descriptionCell}>
    <Text style={styles.typeText}>{directive.type}</Text>
    <Text style={styles.mutedText}>{directive.description}</Text>
  </View>
);

/**
 * Renders description for a Price directive
 */
const renderPriceDescription = (
  directive: JournalPrice,
  styles: ReturnType<typeof getStyles>,
) => (
  <View style={styles.descriptionCell}>
    <Text style={styles.accountText}>
      {formatAmount(directive.amount)}/{directive.currency}
    </Text>
  </View>
);

/**
 * Main render function that routes to the appropriate description renderer
 * based on the directive type
 */
const renderDescription = (
  directive: JournalDirectiveType,
  styles: ReturnType<typeof getStyles>,
  t: (key: string) => string,
) => {
  if (isJournalTransaction(directive))
    return renderTransactionDescription(directive, styles);
  if (isJournalBalance(directive))
    return renderBalanceDescription(directive, styles);
  if (isJournalDocument(directive))
    return renderDocumentDescription(directive, styles);
  if (isJournalOpen(directive)) return renderOpenDescription(directive, styles);
  if (isJournalClose(directive))
    return renderCloseDescription(directive, styles);
  if (isJournalNote(directive)) return renderNoteDescription(directive, styles);
  if (isJournalPad(directive)) return renderPadDescription(directive, styles);
  if (isJournalCustom(directive))
    return renderCustomDescription(directive, styles);
  if (isJournalEvent(directive))
    return renderEventDescription(directive, styles);
  if (isJournalPrice(directive))
    return renderPriceDescription(directive, styles);
  return (
    <View style={styles.descriptionCell}>
      <Text style={styles.narrationText}>
        {t("journal.unknownDirectiveType")}
      </Text>
    </View>
  );
};

interface JournalItemDescriptionProps {
  entry: JournalDirectiveType;
}

/**
 * Component for rendering the description cell of a journal entry
 * Routes to appropriate renderer based on directive type
 */
export const JournalItemDescription: React.FC<JournalItemDescriptionProps> = ({
  entry,
}) => {
  const styles = useThemeStyle(getStyles);
  const { t } = useTranslations();

  return renderDescription(entry, styles, t);
};
