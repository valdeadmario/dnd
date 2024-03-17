import React from "react";
import classNames from "classnames";
import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import styles from "./MenuItem.module.css";

const animateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true });

export const MenuItem = ({
  activeTab,
  handleTabChange,
  title,
  index,
  disabled,
}) => {
  const { active, over, setNodeRef } = useSortable({
    id: title,
    data: {
      type: "tab",
      children: [],
    },
    animateLayoutChanges,
  });

  const isOverTab =
    over && title === over.id && active?.data.current?.type !== "tab";

  return (
    <li
      key={index}
      className={classNames(styles.tab, {
        [styles.selected]: index === activeTab,
        [styles.hover]: isOverTab,
      })}
      onClick={() => handleTabChange(index)}
      ref={disabled ? undefined : setNodeRef}
    >
      <span> {title}</span>
    </li>
  );
};
