import React, { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { DragOverlay, defaultDropAnimation } from "@dnd-kit/core";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { getChildCount } from "../../helpers/utilities";
import { SortableTask } from "../SortableTask";
import "./TaskList.css";

const dropAnimationConfig = {
  keyframes({ transform }) {
    return [];
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
  const [selectedTask, setSelectedTask] = useState(null);
  const sortedIds = useMemo(
    () => flattenedItems.map(({ id }) => id),
    [flattenedItems]
  );
  const activeItemIndex = activeId
    ? flattenedItems.findIndex(({ id }) => id === activeId)
    : -1;

  const activeItem = activeId ? flattenedItems[activeItemIndex] : null;

  return (
    <SortableContext
      items={sortedIds}
      strategy={verticalListSortingStrategy}
    >
      <TransitionGroup exit={!activeItem}>
        {flattenedItems.map(
          (
            {
              id,
              collapsed,
              depth,
              isGroup,
              name,
              color,
              parentId,
              isLastChild,
            },
            idx
          ) => (
            <CSSTransition
              key={id}
              timeout={200}
              classNames="task"
            >
              <div>
                <SortableTask
                  id={id}
                  value={id}
                  name={name}
                  color={
                    color ||
                    (parentId &&
                      flattenedItems.find(({ id }) => id === parentId)?.color)
                  }
                  draggableIsGroup={activeItem?.isGroup}
                  childCount={getChildCount(items, activeId) + 1}
                  depth={id === activeId && projected ? projected.depth : depth}
                  isGroup={isGroup}
                  indentationWidth={indentationWidth}
                  isSelected={selectedTask === id}
                  onSelect={() => setSelectedTask(id)}
                  collapsed={collapsed && isGroup}
                  onCollapse={() => handleCollapse(id)}
                  isBelowDraggable={activeId && idx > activeItemIndex}
                  isUpperDraggable={activeId && idx < activeItemIndex}
                  isLastChild={isLastChild}
                />
              </div>
            </CSSTransition>
          )
        )}
      </TransitionGroup>
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
              cloneDepth={projected?.depth}
            />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </SortableContext>
  );
};
