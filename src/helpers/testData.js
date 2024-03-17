const firstListInitialItemsItems = [
  {
    id: "Home",
    isGroup: false,
    name: "Home",
    checked: false,
  },
  {
    id: "Collections",
    name: "Collections",
    color: "239, 108, 0",
    isGroup: true,
    children: [
      { id: "Spring", name: "Spring", checked: false },
      { id: "Summer", name: "Summer", checked: false },
      { id: "Fall", name: "Fall", checked: false },
      { id: "Winter", name: "Winter", checked: false },
    ],
  },
  {
    id: "About Us",
    isGroup: false,
    name: "About Us",
    checked: false,
  },
  {
    id: "My Account",
    name: "My Account",
    isGroup: true,
    color: "46, 125, 50",
    children: [
      { id: "Addresses", name: "Addresses", checked: false },
      { id: "Order History", name: "Order History", checked: false },
    ],
  },
];

const secondListInitialItems = [
  {
    id: "Pass tests",
    name: "Pass tests",
    color: "239, 108, 0",
    isGroup: true,
    children: [
      { id: "Math", name: "Math", checked: false },
      { id: "Language", name: "Language", checked: false },
      { id: "Exam", name: "Exam", checked: false },
    ],
  },
  {
    id: "Check homework",
    isGroup: false,
    name: "Check homework",
    checked: false,
  },
  {
    id: "Clean house",
    isGroup: false,
    name: "Clean house",
    checked: false,
  },
  {
    id: "Visit doctor",
    isGroup: false,
    name: "Visit doctor",
    checked: false,
  },
  {
    id: "Dance",
    isGroup: false,
    name: "Dance",
    checked: false,
  },
  {
    id: "Help friend",
    isGroup: false,
    name: "Help friend",
    checked: false,
  },
];

export const defaultLists = [
  {
    id: 1,
    name: "Task list 1",
    taskList: firstListInitialItemsItems,
  },
  {
    id: 2,
    name: "Task list 2",
    taskList: secondListInitialItems,
  },
];
