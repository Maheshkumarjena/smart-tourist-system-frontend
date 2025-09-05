import AsyncStorage from '@react-native-async-storage/async-storage';

interface QueuedRequest {
  id: string;
  url: string;
  method: string;
  data?: any;
  timestamp: string;
}

class OfflineQueue {
  private static instance: OfflineQueue;
  private queue: QueuedRequest[] = [];
  private isProcessing = false;

  static getInstance(): OfflineQueue {
    if (!OfflineQueue.instance) {
      OfflineQueue.instance = new OfflineQueue();
    }
    return OfflineQueue.instance;
  }

  async addToQueue(request: Omit<QueuedRequest, 'id' | 'timestamp'>) {
    const queuedRequest: QueuedRequest = {
      ...request,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    this.queue.push(queuedRequest);
    await this.saveQueue();
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;
    
    while (this.queue.length > 0) {
      const request = this.queue.shift()!;
      
      try {
        await this.executeRequest(request);
        console.log(`Processed queued request: ${request.url}`);
      } catch (error) {
        console.error(`Failed to process request: ${request.url}`, error);
        // Re-add to queue if it's a temporary failure
        this.queue.unshift(request);
        break;
      }
    }

    await this.saveQueue();
    this.isProcessing = false;
  }

  private async executeRequest(request: QueuedRequest) {
    const response = await fetch(request.url, {
      method: request.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: request.data ? JSON.stringify(request.data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  private async saveQueue() {
    try {
      await AsyncStorage.setItem('offlineQueue', JSON.stringify(this.queue));
    } catch (error) {
      console.error('Failed to save offline queue:', error);
    }
  }

  async loadQueue() {
    try {
      const queueData = await AsyncStorage.getItem('offlineQueue');
      if (queueData) {
        this.queue = JSON.parse(queueData);
      }
    } catch (error) {
      console.error('Failed to load offline queue:', error);
    }
  }
}

export default OfflineQueue;