/**
 * Database interface definition for Zenith Flow.
 * Defines the operations required for the workspace storage.
 */
export class DatabaseService {
  /**
   * Fetch all tasks from the store.
   * @returns {Promise<Array>} A promise that resolves to the array of tasks.
   */
  async getTasks() {
    throw new Error('Method getTasks() not implemented');
  }

  /**
   * Save or update a task.
   * @param {Object} task - The task object to save.
   * @returns {Promise<Object>} A promise resolving to the saved task.
   */
  async saveTask(task) {
    throw new Error('Method saveTask() not implemented');
  }

  /**
   * Delete a task by ID.
   * @param {string} taskId - The ID of the task.
   * @returns {Promise<boolean>} A promise resolving to true if deleted successfully.
   */
  async deleteTask(taskId) {
    throw new Error('Method deleteTask() not implemented');
  }

  /**
   * Seed the database with default tasks if empty.
   * @returns {Promise<Array>} A promise resolving to the list of tasks.
   */
  async seedDefaultData() {
    throw new Error('Method seedDefaultData() not implemented');
  }
}
