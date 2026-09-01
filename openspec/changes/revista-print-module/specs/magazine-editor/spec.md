# Magazine Editor Specification

## Purpose

Defines correct behavior for product placement, drag-and-drop, selection highlighting, and template switching in the `/revista` builder, replacing four verified defects with specified correct behavior.

## Requirements

### Requirement: Selection Highlight Visibility

When a product is being placed, the system MUST visibly highlight both the corresponding item in the product rail and every empty slot eligible to receive it.

#### Scenario: Highlight renders using valid styling

- GIVEN a product is selected for placement
- WHEN the rail and sheet are rendered
- THEN the selected rail item shows a visible highlight style
- AND every empty, eligible slot on the current sheet shows a visible highlight style

### Requirement: Rail Products Are Draggable When Unplaced

An unplaced product in the rail MUST be draggable onto an empty slot.

#### Scenario: Drag unplaced product from rail

- GIVEN a product in the rail that is not currently placed on any sheet
- WHEN the user drags it onto an empty slot
- THEN the product is placed into that slot

### Requirement: Dragging a Placed Product Moves It

Dragging a product that is already placed in some slot onto a different slot MUST move it, not duplicate it.

#### Scenario: Drag placed product to a new slot

- GIVEN a product already placed in slot A
- WHEN the user drags that product onto empty slot B
- THEN the product appears in slot B
- AND slot A becomes empty
- AND the product appears exactly once across the entire magazine

### Requirement: Template Switch Remaps By Slot Order With Loss Confirmation

Switching a sheet's template MUST remap placed products by slot order (not by slot id) between the source and target template. If the target template has fewer slots than the source has filled, the system MUST warn the user with the exact count of products that would be dropped and MUST require confirmation before applying the switch.

#### Scenario: Switch preserves products by order when target has enough slots

- GIVEN a sheet using a template with slots filled in order [P1, P2, P3]
- WHEN the user switches to a target template with 3 or more slots
- THEN P1, P2, P3 occupy the target template's first three slots in the same order

#### Scenario: Switch warns and requires confirmation before dropping products

- GIVEN a sheet with 3 products placed and the user selects a target template with only 2 slots
- WHEN the switch is initiated
- THEN the system shows a confirmation prompt stating that 1 product will be dropped
- AND no product is removed until the user confirms
- AND if the user cancels, the sheet keeps its original template and all 3 products

### Requirement: No Unused Selection State Persisted

The editor MUST NOT persist product-selection tracking data to localStorage that has no effect on rendered behavior. Selection highlighting is driven solely by the active placement target described in Selection Highlight Visibility.

#### Scenario: Persisted page has no dead selection fields

- GIVEN a magazine page saved to the `crediexpress-magazine-builder` localStorage key
- WHEN the saved payload is inspected
- THEN it contains no selection-tracking field that is unused by rendering (e.g. no unused `selectedIds` list)
