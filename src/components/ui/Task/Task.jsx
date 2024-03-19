import React, { forwardRef } from "react";
import classNames from "classnames";
import { ActionButton } from "../ActionButton";
import styles from "./Task.module.css";

function clearSelection() {
  if (document.selection && document.selection.empty) {
    document.selection.empty();
  } else if (window.getSelection) {
    var sel = window.getSelection();
    sel.removeAllRanges();
  }
}

export const Task = forwardRef(
  (
    {
      childCount,
      clone,
      depth,
      disableSelection,
      disableInteraction,
      ghost,
      handleProps,
      indentationWidth,
      indicator,
      collapsed,
      onCollapse,
      style,
      value,
      wrapperRef,
      isGroup,
      color,
      name,
      isSelected,
      onSelect,
      cloneDepth,
      overTaskList,
      ...props
    },
    ref
  ) => {
    return (
      <>
        <div
          className={classNames(
            styles.wrapper,
            clone && styles.clone,
            ghost && styles.ghost,
            disableSelection && styles.disableSelection,
            disableInteraction && styles.disableInteraction,
            overTaskList && styles.overTaskList
          )}
          ref={wrapperRef}
          style={{
            "--spacing": `${indentationWidth * depth}px`,
            "--groupColor": color,
          }}
          {...props}
        >
          <div
            onClick={!isGroup ? onSelect : undefined}
            onDoubleClick={isGroup ? onCollapse : undefined}
            className={classNames(styles.taskItem, {
              [styles.group]: isGroup,
              [styles.child]: !!depth,
              [styles.selected]: isSelected,
            })}
            ref={ref}
            style={{
              ...style,
              "--cloneDepth": `${
                indentationWidth * Number(depth ? !cloneDepth : -cloneDepth)
              }px`,
              "--cloneMargin": `-${indentationWidth * depth * 1.5}px`,
            }}
            {...handleProps}
          >
            {isGroup && (
              <ActionButton
                onClick={onCollapse}
                className={classNames(
                  styles.collapse,
                  (collapsed || (clone && isGroup)) && styles.collapsed
                )}
              >
                {collapseIcon}
              </ActionButton>
            )}
            {!isGroup && (
              <input
                id="html"
                type="checkbox"
                className={styles.checkbox}
              />
            )}
            <span className={styles.text}>{name}</span>
          </div>
        </div>
      </>
    );
  }
);

const collapseIcon = (
  <svg
    width="9"
    height="6"
    viewBox="0 0 9 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.6065 5.39697L8.62506 1.25292C8.87582 0.994336 8.72382 0.5 8.39356 0.5H0.35644C0.0261801 0.5 -0.125816 0.994336 0.124935 1.25292L4.1435 5.39697C4.27671 5.53434 4.47329 5.53434 4.6065 5.39697Z"
      fill="#000000"
    />
  </svg>
);
