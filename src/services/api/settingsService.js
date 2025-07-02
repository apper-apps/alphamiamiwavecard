import { toast } from 'react-toastify';

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

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "logo_url" } },
        { field: { Name: "animation_settings" } },
        { field: { Name: "theme" } }
      ],
      pagingInfo: {
        limit: 10,
        offset: 0
      }
    };

const response = await apperClient.fetchRecords('settings', params);

    if (!response.success) {
console.error(response.message);
      toast.error(response.message);
      return [];
    }

    // Handle empty or undefined data
    if (!response.data || response.data.length === 0) {
      return [];
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return [];
  }
}

async function getById(id) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "logo_url" } },
        { field: { Name: "animation_settings" } },
        { field: { Name: "theme" } }
      ]
    };

const response = await apperClient.getRecordById('settings', id, params);

    if (!response.success) {
console.error(response.message);
      toast.error(response.message);
      return null;
    }

    // Handle empty or undefined data
    if (!response.data) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching setting with ID ${id}:`, error);
    return null;
  }
}

async function create(settingData) {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Only include Updateable fields
    const params = {
      records: [{
        logo_url: settingData.logo_url || "",
        animation_settings: settingData.animation_settings || "",
        theme: settingData.theme || "default"
      }]
    };

const response = await apperClient.createRecord('settings', params);

    if (!response.success) {
console.error(response.message);
      toast.error(response.message);
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

    // Only include Updateable fields plus ID
    const params = {
      records: [{
        Id: id,
        logo_url: settingData.logo_url,
        animation_settings: settingData.animation_settings,
        theme: settingData.theme
      }]
    };

const response = await apperClient.updateRecord('settings', params);

    if (!response.success) {
console.error(response.message);
      toast.error(response.message);
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

    if (!response.success) {
console.error(response.message);
      toast.error(response.message);
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