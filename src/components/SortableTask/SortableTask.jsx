import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Task } from "../ui";
import { iOS } from "../../helpers/utilities";

const animateLayoutChanges = ({ isSorting, wasDragging }) =>
  isSorting || wasDragging ? false : true;

export const SortableTask = ({
  id,
  depth,
  draggableIsGroup,
  isUpperDraggable,
  isBelowDraggable,
  isLastChild,
  ...props
}) => {
  const {
    attributes,
    isDragging,
    isSorting,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition,
    over,
  } = useSortable({
    id,
    animateLayoutChanges,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const overTaskList = over?.data.current?.type === "tab";

  return (
    <Task
      ref={setDraggableNodeRef}
      wrapperRef={
        draggableIsGroup &&
        ((!!depth && (!isLastChild || isUpperDraggable)) ||
          (isBelowDraggable && props.isGroup))
          ? null
          : setDroppableNodeRef
      }
      style={style}
      depth={depth}
      ghost={isDragging}
      overTaskList={isDragging && overTaskList}
      disableSelection={iOS}
      disableInteraction={isSorting}
      handleProps={{
        ...attributes,
        ...listeners,
      }}
      {...props}
    />
  );
};
