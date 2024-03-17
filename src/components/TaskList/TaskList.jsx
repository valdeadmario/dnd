import React, { useMemo } from "react";
import { createPortal } from "react-dom";
import { DragOverlay, defaultDropAnimation } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { getChildCount } from "../../helpers/utilities";
import { SortableTask } from "../SortableTask";

const dropAnimationConfig = {
  keyframes({ transform }) {
    return [
      { opacity: 1, transform: CSS.Transform.toString(transform.initial) },
      {
        opacity: 0,
        transform: CSS.Transform.toString({
          ...transform.final,
          x: transform.final.x + 5,
          y: transform.final.y + 5,
        }),
      },
    ];
  },
  easing: "ease-out",
  sideEffects({ active }) {
    active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: defaultDropAnimation.duration,
      easing: defaultDropAnimation.easing,
    });
  },
};

export const TaskList = ({
  indentationWidth,
  items,
  activeId,
  handleCollapse,
  flattenedItems,
  projected,
}) => {
  const sortedIds = useMemo(
    () => flattenedItems.map(({ id }) => id),
    [flattenedItems]
  );
  const activeItem = activeId
    ? flattenedItems.find(({ id }) => id === activeId)
    : null;

  return (
    <SortableContext
      items={sortedIds}
      strategy={verticalListSortingStrategy}
    >
      {flattenedItems.map(
        ({
          id,
          children,
          collapsed,
          depth,
          isGroup,
          name,
          color,
          parentId,
        }) => (
          <SortableTask
            key={id}
            id={id}
            value={id}
            name={name}
            color={
              color ||
              (parentId &&
                flattenedItems.find(({ id }) => id === parentId)?.color)
            }
            childCount={getChildCount(items, activeId) + 1}
            depth={id === activeId && projected ? projected.depth : depth}
            isGroup={isGroup}
            indentationWidth={indentationWidth}
            collapsed={collapsed && isGroup}
            onCollapse={() => handleCollapse(id)}
          />
        )
      )}
      {createPortal(
        <DragOverlay dropAnimation={dropAnimationConfig}>
          {activeId && activeItem ? (
            <SortableTask
              id={activeId}
              depth={activeItem.depth}
              isGroup={activeItem.isGroup}
              name={activeItem.name}
              color={activeItem.color}
              clone
              childCount={getChildCount(items, activeId) + 1}
              value={activeId.toString()}
              indentationWidth={indentationWidth}
            />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </SortableContext>
  );
};
