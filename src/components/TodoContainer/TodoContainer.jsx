import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { TabsPanel, Tab } from "../ui";
import { TaskList } from "../TaskList";
import { defaultLists } from "../../helpers/testData";
import {
  buildTree,
  flattenTree,
  getProjection,
  removeChildrenOf,
  setProperty,
} from "../../helpers/utilities";

const indentationWidth = 20;

const measuring = {
  droppable: {
    strategy: 0,
  },
};

export const TodoContainer = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [lists, setLists] = useState(() => defaultLists);
  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);
  const [offsetLeft, setOffsetLeft] = useState(0);

  const items = lists[activeTab].taskList;

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(items);
    const collapsedItems = flattenedTree.reduce(
      (acc, { children, collapsed, id }) =>
        collapsed && children.length ? [...acc, id] : acc,
      []
    );

    return removeChildrenOf(
      flattenedTree,
      activeId ? [activeId, ...collapsedItems] : collapsedItems
    );
  }, [activeId, items]);

  const sensorContext = useRef({
    items: flattenedItems,
    offset: offsetLeft,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 180,
        tolerance: 5,
      },
    })
  );

  const projected =
    activeId && overId
      ? getProjection(
          flattenedItems,
          activeId,
          overId,
          offsetLeft,
          indentationWidth
        )
      : null;

  useEffect(() => {
    sensorContext.current = {
      items: flattenedItems,
      offset: offsetLeft,
    };
  }, [flattenedItems, offsetLeft]);

  const resetState = () => {
    setOverId(null);
    setActiveId(null);
    setOffsetLeft(0);

    document.body.style.setProperty("cursor", "");
  };

  const handleCollapse = (id) => {
    setLists(
      lists.map((tab, idx) =>
        idx === activeTab
          ? {
              ...tab,
              taskList: setProperty(tab.taskList, id, "collapsed", (value) => {
                return !value;
              }),
            }
          : tab
      )
    );
  };

  const handleDragCancel = () => {
    resetState();
  };

  const handleDragStart = ({ active }) => {
    setActiveId(active.id);
    setOverId(active.id);

    document.body.style.setProperty("cursor", "grabbing");
  };

  const handleDragMove = ({ delta }) => {
    setOffsetLeft(delta.x);
  };

  const handleDragOver = ({ over }) => {
    setOverId(over?.id ?? null);
  };

  const handleDragEnd = ({ active, over }) => {
    resetState();

    if (projected && over) {
      const taskListNames = lists.map(({ name }) => name);

      const { depth, parentId } = projected;
      const clonedItems = JSON.parse(JSON.stringify(flattenTree(items)));
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id);
      const activeTreeItem = clonedItems[activeIndex];

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId };

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      const updatedItems = taskListNames.includes(over.id)
        ? sortedItems.filter(
            ({ id, parentId }) => id !== active.id && parentId !== active.id
          )
        : sortedItems;

      const newItems = buildTree(updatedItems);

      if (taskListNames.includes(over.id)) {
        const taskListIndex = lists.findIndex(({ name }) => name === over.id);

        const updatedTaskLists = lists
          .map((tab, idx) =>
            idx === taskListIndex
              ? { ...tab, taskList: [...tab.taskList, activeTreeItem] }
              : tab
          )
          .map((tab, idx) =>
            idx === activeTab ? { ...tab, taskList: newItems } : tab
          );

        setLists(updatedTaskLists);

        return;
      }

      setLists(
        lists.map((tab, idx) =>
          idx === activeTab ? { ...tab, taskList: newItems } : tab
        )
      );
    }
  };

  return (
    <DndContext
      sensors={sensors}
      measuring={measuring}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <TabsPanel
        activeTab={activeTab}
        handleTabChange={setActiveTab}
      >
        {lists.map(({ id, name, taskList }) => (
          <Tab
            key={id}
            title={name}
          >
            <TaskList
              projected={projected}
              flattenedItems={flattenedItems}
              items={taskList}
              activeId={activeId}
              offsetLeft={offsetLeft}
              handleCollapse={handleCollapse}
              indentationWidth={indentationWidth}
            />
          </Tab>
        ))}
      </TabsPanel>
    </DndContext>
  );
};
