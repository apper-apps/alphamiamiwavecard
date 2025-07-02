import { toast } from "react-toastify";
import React from "react";

// Utility function for delays
// Settings service for managing logo and animation settings
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function getAll() {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Configure fields based on settings table schema
    const params = {
      fields: [
        {
          field: {
            Name: "Name"
          }
        },
        {
          field: {
            Name: "Tags"
          }
        },
        {
          field: {
            Name: "Owner"
          }
        },
        {
          field: {
            Name: "logo_url"
          }
        },
        {
          field: {
            Name: "animation_settings"
          }
        },
        {
          field: {
            Name: "theme"
          }
        },
        {
          field: {
            Name: "CreatedOn"
          }
        },
        {
          field: {
            Name: "ModifiedOn"
          }
        }
      ]
    };

// Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.fetchRecords("settings", params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching settings:", error);
    toast.error("Failed to fetch settings");
    throw error;
  }
}
async function getById(id) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

// Configure fields for single record retrieval
    const params = {
      fields: [
        {
          field: {
            Name: "Name"
          }
        },
        {
          field: {
            Name: "Tags"
          }
        },
        {
          field: {
            Name: "Owner"
          }
        },
        {
          field: {
            Name: "logo_url"
          }
        },
        {
          field: {
            Name: "animation_settings"
          }
        },
        {
          field: {
            Name: "theme"
          }
        },
        {
          field: {
            Name: "CreatedOn"
          }
        },
        {
          field: {
            Name: "ModifiedOn"
          }
        }
      ]
    };

// Initialize ApperClient
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    const response = await apperClient.getRecordById("settings", id, params);
    
    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching setting with ID ${id}:`, error);
    toast.error("Failed to fetch setting");
    throw error;
}
}

async function create(settingData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Filter to only include Updateable fields for creation
    const updateableData = {
      Name: settingData.Name,
      logo_url: settingData.logo_url,
      animation_settings: settingData.animation_settings,
      theme: settingData.theme,
      Tags: settingData.Tags,
      Owner: settingData.Owner
    };

    const params = {
      records: [updateableData]
    };

    const response = await apperClient.createRecord('settings', params);

    if (!response || !response.success) {
      const errorMessage = response?.message || 'Failed to create setting';
      console.error(errorMessage);
      toast.error(errorMessage);
      return null;
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulRecords.length > 0) {
        toast.success('Setting created successfully');
        return successfulRecords[0].data;
      }
      
      return null;
    }

    toast.success('Setting created successfully');
    return response.data;
  } catch (error) {
    console.error("Error creating setting:", error);
    toast.error("Failed to create setting");
    return null;
  }
}

async function update(id, settingData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

// Filter to only include Updateable fields for update
    // Filter to only include Updateable fields for update
    const updateableData = {
      Id: id, // Required for update
      Name: settingData.Name,
      logo_url: settingData.logo_url,
      animation_settings: settingData.animation_settings,
      theme: settingData.theme,
      Tags: settingData.Tags,
      Owner: settingData.Owner
    };

    const params = {
      records: [updateableData]
    };

    const response = await apperClient.updateRecord('settings', params);

    if (!response || !response.success) {
      const errorMessage = response?.message || 'Failed to update setting';
      console.error(errorMessage);
      toast.error(errorMessage);
      return null;
    }

    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          record.errors?.forEach(error => {
            toast.error(`${error.fieldLabel}: ${error.message}`);
          });
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulRecords.length > 0) {
        toast.success('Setting updated successfully');
        return successfulRecords[0].data;
      }
      
      return null;
    }

    toast.success('Setting updated successfully');
    return response.data;
  } catch (error) {
    console.error("Error updating setting:", error);
    return null;
  }
}

async function deleteRecord(id) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

const params = {
      RecordIds: [id]
    };

    const response = await apperClient.deleteRecord('settings', params);

    if (!response || !response.success) {
      const errorMessage = response?.message || 'Failed to delete setting';
      console.error(errorMessage);
      toast.error(errorMessage);
      return false;
    }
    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        
        failedDeletions.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      
      if (successfulDeletions.length > 0) {
        toast.success('Setting deleted successfully');
        return true;
      }
      
      return false;
    }

    toast.success('Setting deleted successfully');
    return true;
  } catch (error) {
    console.error("Error deleting setting:", error);
    return false;
  }
}

export { getAll, getById, create, update, deleteRecord };