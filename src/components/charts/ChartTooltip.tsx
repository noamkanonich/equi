"use client";

import type { TooltipContentProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import type { ContentType } from "recharts/types/component/Tooltip";
import styled from "styled-components";

export type ChartTooltipRow = {
  label: string;
  value: string;
  percent?: string;
  change?: string;
};

export type ChartTooltipContentProps = {
  active?: boolean;
  payload?: TooltipContentProps<number, string>["payload"];
  label?: string | number;
  rows?: ChartTooltipRow[];
  formatRows?: (
    props: Pick<
      ChartTooltipContentProps,
      "active" | "payload" | "label"
    >,
  ) => ChartTooltipRow[] | null;
};

export const ChartTooltipContent = ({
  active,
  payload,
  label,
  rows,
  formatRows,
}: ChartTooltipContentProps) => {
  if (!active || !payload?.length) {
    return null;
  }

  const resolvedRows =
    rows ??
    formatRows?.({ active, payload, label }) ??
    buildDefaultRows(payload, label);

  if (!resolvedRows?.length) {
    return null;
  }

  return (
    <TooltipCard>
      {resolvedRows.map((row) => (
        <Row key={`${row.label}-${row.value}`}>
          {row.label ? <RowLabel>{row.label}</RowLabel> : null}
          <RowValues>
            <RowValue>{row.value}</RowValue>
            {row.percent ? <RowMeta>{row.percent}</RowMeta> : null}
            {row.change ? <RowMeta>{row.change}</RowMeta> : null}
          </RowValues>
        </Row>
      ))}
    </TooltipCard>
  );
};

export const createChartTooltipRenderer = (
  formatRows: NonNullable<ChartTooltipContentProps["formatRows"]>,
): ContentType<ValueType, NameType> => {
  const renderTooltip = (props: TooltipContentProps<ValueType, NameType>) => (
    <ChartTooltipContent
      active={props.active}
      payload={props.payload}
      label={props.label}
      formatRows={formatRows}
    />
  );

  return renderTooltip as ContentType<ValueType, NameType>;
};

const buildDefaultRows = (
  payload: TooltipContentProps<number, string>["payload"],
  label?: string | number,
): ChartTooltipRow[] => {
  const entry = payload[0];
  if (!entry) {
    return [];
  }

  const displayLabel =
    typeof label === "string" || typeof label === "number"
      ? String(label)
      : String(entry.name ?? "");

  const value =
    entry.value === undefined || entry.value === null
      ? ""
      : String(entry.value);

  return [{ label: displayLabel, value }];
};

const TooltipCard = styled.div`
  pointer-events: none;
  max-inline-size: 12.5rem;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background.card};
  box-shadow: ${({ theme }) => theme.colors.shadow.soft};
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  &:not(:last-child) {
    margin-block-end: ${({ theme }) => theme.spacing.xs};
    padding-block-end: ${({ theme }) => theme.spacing.xs};
    border-block-end: 1px solid ${({ theme }) => theme.colors.border.subtle};
  }
`;

const RowLabel = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
  text-align: start;
  word-break: break-word;
`;

const RowValues = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const RowValue = styled.strong`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.preset.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  line-height: ${({ theme }) => theme.typography.preset.body.lineHeight};
`;

const RowMeta = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.typography.preset.caption.fontSize};
  line-height: ${({ theme }) => theme.typography.preset.caption.lineHeight};
`;
