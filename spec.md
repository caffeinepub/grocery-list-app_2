# Grocery List App

## Current State
New project with empty backend and no frontend.

## Requested Changes (Diff)

### Add
- Grocery shopping list app with full CRUD for list items
- Items have: name, quantity, category, checked/unchecked state
- Predefined categories: Fresh Produce, Dairy & Eggs, Meat & Seafood, Snacks, Beverages, Bakery, Household
- Add new items with name, quantity, and category
- Check off / uncheck items as purchased
- Clear all checked items
- Start a new/fresh list
- Filter view: All, Pending, Checked
- Items grouped by category in the list view

### Modify
- None

### Remove
- None

## Implementation Plan
1. Backend: store grocery items with id, name, quantity, category, isChecked
2. APIs: addItem, getItems, toggleItem, deleteItem, clearChecked, clearAll
3. Frontend: header, add-item form, filter tabs, grouped list by category, item rows with checkbox+quantity+category tag+delete, action buttons
