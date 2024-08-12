import React, { useContext, useState } from 'react';
import { DashboardContext } from '../DashboardContextApi';
import { Button, Snackbar, Drawer, TextField, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';

function Widget({ widget, onRemove }) {
  return (
    <div style={{ 
      border: '1px solid #ddd', 
      borderRadius: '4px', 
      padding: '10px', 
      margin: '5px', 
      flex: '1 1 auto', 
      minWidth: '150px', 
      maxWidth: '200px',
      boxSizing: 'border-box' // Ensures padding and border are included in width/height
    }}>
      <h4>{widget.name}</h4>
      <p>{widget.text}</p>
    </div>
  );
}

function Dashboard() {
  const { categories, addWidget, deleteWidget } = useContext(DashboardContext);
  const [newWidget, setNewWidget] = useState({ name: '', text: '' });
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [widgetToDelete, setWidgetToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  const handleAddWidget = () => {
    if (selectedCategoryId && newWidget.name && newWidget.text) {
      const widget = {
        id: Date.now().toString(),
        name: newWidget.name,
        text: newWidget.text,
      };
      addWidget(selectedCategoryId, widget);
      setNewWidget({ name: '', text: '' });
      setSnackbarMessage('Widget added successfully!');
      setSnackbarOpen(true);
      setIsDrawerOpen(false);
    }
  };

  const handleOpenDrawer = () => setIsDrawerOpen(true);
  const handleCloseDrawer = () => setIsDrawerOpen(false);

  const handleOpenConfirmDialog = (widget) => {
    setWidgetToDelete(widget);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setWidgetToDelete(null);
    setConfirmDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    if (widgetToDelete) {
      deleteWidget(widgetToDelete.categoryId, widgetToDelete.id);
      setSnackbarMessage('Widget deleted successfully!');
      setSnackbarOpen(true);
    }
    handleCloseConfirmDialog();
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  const handleAddWidgetFromEmptyBox = (categoryId) => {
    setSelectedCategoryId(categoryId);
    setIsDrawerOpen(true);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Typography variant="h4" align="center" gutterBottom>
         CNAPP Dashboard
      </Typography>
      <div className="mb-4">
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenDrawer}
          size="large"
          sx={{ borderRadius: '50px', boxShadow: 3 }}
        >
          Add Widget
        </Button>
      </div>

      <div>
        {categories.length > 0 ? (
          categories.map(cat => (
            <div key={cat.id} className="mb-6 p-4 bg-white rounded-lg shadow-lg">
              <Typography variant="h5" gutterBottom>
                {cat.name}
              </Typography>
              <div className="flex flex-wrap gap-4"> {/* Add gap here */}
                {cat.widgets.length > 0 ? (
                  cat.widgets.map(widget => (
                    <div key={widget.id} className="flex justify-between items-center p-2 bg-gray-100 rounded-lg mb-2">
                      <Widget widget={widget} />
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleOpenConfirmDialog({ ...widget, categoryId: cat.id })}
                        size="small"
                        sx={{ borderRadius: '50px' }}
                      >
                        Delete
                      </Button>
                    </div>
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No widgets available
                  </Typography>
                )}
                <div 
                  className="flex justify-center items-center p-4 bg-gray-200 rounded-lg border-dashed border-2 border-gray-300 cursor-pointer"
                  onClick={() => handleAddWidgetFromEmptyBox(cat.id)}
                >
                  <AddIcon color="action" sx={{ fontSize: 40 }} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            No categories available
          </Typography>
        )}
      </div>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        sx={{ '.MuiDrawer-paper': { width: 360, padding: 2 } }}
      >
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6">Add New Widget</Typography>
          <IconButton onClick={handleCloseDrawer} color="inherit">
            <CloseIcon />
          </IconButton>
        </div>
        <div className="mb-4">
          <TextField
            select
            label="Category"
            fullWidth
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            SelectProps={{ native: true }}
            variant="outlined"
            sx={{ mb: 2 }}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </TextField>
        </div>
        <TextField
          label="Widget Name"
          variant="outlined"
          fullWidth
          value={newWidget.name}
          onChange={(e) => setNewWidget({ ...newWidget, name: e.target.value })}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Widget Text"
          variant="outlined"
          fullWidth
          value={newWidget.text}
          onChange={(e) => setNewWidget({ ...newWidget, text: e.target.value })}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleAddWidget}
          size="large"
          sx={{ borderRadius: '50px' }}
        >
          Add Widget
        </Button>
      </Drawer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <Button color="inherit" onClick={handleSnackbarClose}>
            Close
          </Button>
        }
        sx={{ marginBottom: '64px' }}
      />

      {/* Confirmation Dialog for Delete */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this widget? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Dashboard;
