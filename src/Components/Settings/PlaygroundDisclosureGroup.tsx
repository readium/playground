"use client";

import { Key, ReactNode } from "react";

import settingsStyles from "./assets/styles/playgroundSettings.module.css";

import Chevron from "./assets/icons/chevron_right.svg";

import { ThBreakpoints } from "@edrlab/thorium-web/core/preferences";

import { Disclosure, DisclosurePanel, Button, Heading } from "react-aria-components";
import classNames from "classnames";

import { useAppSelector, StatefulDropdown } from "@edrlab/thorium-web/epub";

interface PlaygroundDisclosureGroupProps<T> {
  id: string;
  title?: string;
  standalone?: boolean;
  breakpoints: ThBreakpoints[];
  value: Record<string, T>;
  options: Array<{ id: string; label: string; value: T }>;
  isDisabled?: boolean;
  renderValue?: (value: T) => ReactNode;
  onChange: (breakpoint: ThBreakpoints, value: T) => void;
}

export function PlaygroundDisclosureGroup<T>({
  id,
  title,
  standalone = true,
  breakpoints,
  value,
  options,
  isDisabled = false,
  onChange,
}: PlaygroundDisclosureGroupProps<T>) {
  const currentBreakpoint = useAppSelector(state => state.theming.breakpoint);
  const isRTL = useAppSelector(state => state.publication.isRTL);

  if (!breakpoints.length) {
    return null;
  }

  const currentValue = currentBreakpoint ? value[currentBreakpoint] : undefined;
  const currentSelectedOption = currentValue ? options.find(opt => opt.value === currentValue) : options[0];
  const otherBreakpoints = currentBreakpoint ? breakpoints.filter(bp => bp !== currentBreakpoint) : [];


  return (
    <div className={ settingsStyles.readerSettingsGroup } data-settings-id={ id }>
      { standalone && title && 
        <Heading className={ classNames(
          settingsStyles.readerSettingsLabel,
          isDisabled ? settingsStyles.readerSettingsDisclosureLabelDisabled : ""
        ) }>
          { title }
        </Heading> }

      <Disclosure defaultExpanded={ false } className={ settingsStyles.readerSettingsDisclosure }>
        <div className={ settingsStyles.readerSettingsDisclosureHeader }>
          <Button
            slot="trigger"
            className={ settingsStyles.readerSettingsDisclosureButton }
            isDisabled={ isDisabled }
          >
            <div className={ settingsStyles.readerSettingsChevronIcon }>
              <Chevron
                aria-hidden={ true }
                focusable={ false }
                className={ settingsStyles.readerSettingsChevronIcon }
                style={{ transform: isRTL ? "scaleX(-1)" : "none" } as React.CSSProperties }
              />
            </div>
            { currentBreakpoint && (
              <span className={ settingsStyles.readerSettingsDisclosureButtonLabel } aria-hidden={ true }>
                { currentBreakpoint.charAt(0).toUpperCase() + currentBreakpoint.slice(1) }
              </span>
            )}
          </Button>

          { currentBreakpoint && (
            <StatefulDropdown
              standalone={ false }
              className={ settingsStyles.readerSettingsDisclosureHeaderDropdown }
              label={ currentBreakpoint.charAt(0).toUpperCase() + currentBreakpoint.slice(1) }
              isDisabled={ isDisabled }
              selectedKey={ currentSelectedOption?.id }
              onSelectionChange={(key: Key | null) => {
                if (key === null || !currentBreakpoint) return;
                const option = options.find(opt => opt.id === key);
                if (option) {
                  onChange(currentBreakpoint, option.value);
                }
              }}
              items={options.map(option => ({
                id: option.id,
                label: option.label,
                value: option.id,
              }))}
              compounds={ {
                button: {
                  className: classNames(
                    settingsStyles.readerSettingsDropdownButton,
                    settingsStyles.readerSettingsDisclosureHeaderDropdownButton
                  )
                }
              } }
            />
          )}
        </div>

        <DisclosurePanel className={ settingsStyles.readerSettingsDisclosurePanel }>
          {otherBreakpoints.map(breakpoint => {
            const breakpointValue = value[breakpoint];
            const selectedOption = options.find(opt => opt.value === breakpointValue) || options[0];
            const breakpointName = breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1);
            
            return (
              <StatefulDropdown
                standalone={ true }
                key={ breakpoint }
                className={ settingsStyles.readerSettingsInlineDropdown }
                label={ breakpointName }
                isDisabled={ isDisabled }
                selectedKey={ selectedOption?.id }
                onSelectionChange={(key: Key | null) => {
                  if (key === null) return;
                  const option = options.find(opt => opt.id === key);
                  if (option) {
                    onChange(breakpoint, option.value);
                  }
                }}
                items={ options.map(option => ({
                  id: option.id,
                  label: option.label,
                  value: option.id
                })) }
                compounds={ {
                  label: {
                    className: settingsStyles.readerSettingsInlineDropdownLabel
                  },
                  button: {
                    className: classNames(
                      settingsStyles.readerSettingsDropdownButton,
                      settingsStyles.readerSettingsInlineDropdownButton
                    )
                  }
                } }
              />
            );
          })}
        </DisclosurePanel>
      </Disclosure>
    </div>
  );
}
