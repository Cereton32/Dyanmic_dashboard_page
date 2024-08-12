import { createContext, useState, useEffect } from "react";

const DashboardContext = createContext({});

const DashboardProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [totalWidgets, setTotalWidgets] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/categories')
      .then(response => response.json())
      .then((data) => {
        setCategories(data);
        setTotalWidgets(data.flatMap(category => category.widgets));
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  }, []);

  const addWidget = (categoryId, widget) => {
    fetch(`http://localhost:3000/categories/${categoryId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        widgets: [...categories.find(c => c.id === categoryId).widgets, widget]
      })
    })
      .then(response => response.json())
      .then((updatedCategory) => {
        setCategories(categories.map(cat => cat.id === categoryId ? updatedCategory : cat));
        setTotalWidgets([...totalWidgets, widget]);
      })
      .catch((error) => {
        console.error('Add widget error:', error);
      });
  };

  const deleteWidget = (categoryId, widgetId) => {
    fetch(`http://localhost:3000/categories/${categoryId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        widgets: categories.find(c => c.id === categoryId).widgets.filter(widget => widget.id !== widgetId)
      })
    })
      .then(response => response.json())
      .then((updatedCategory) => {
        setCategories(categories.map(cat => cat.id === categoryId ? updatedCategory : cat));
        setTotalWidgets(totalWidgets.filter(widget => widget.id !== widgetId));
      })
      .catch((error) => {
        console.error('Delete widget error:', error);
      });
  };

  return (
    <DashboardContext.Provider value={{ categories, addWidget, deleteWidget }}>
      {children}
    </DashboardContext.Provider>
  );
};

export { DashboardContext, DashboardProvider };
