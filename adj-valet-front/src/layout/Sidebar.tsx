import { useState } from 'react';
import { Button } from '../components/Button';
import { useADJState, useADJActions } from '../store/ADJStore';

interface Props {
  selectedSection: string;
  onSelectedSection: (section: string) => void;
}

export const Sidebar = ({ selectedSection, onSelectedSection }: Props) => {
  const { config, isLoading, error } = useADJState();
  const { saveConfig, resetState, addBoard } = useADJActions();
  const [localError, setLocalError] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const handleSave = async () => {
    try {
      setLocalError('');
      await saveConfig();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save configuration';
      setLocalError(message);
      setTimeout(() => setLocalError(''), 3000);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset? This will clear the current ADJ path and reload the application.')) {
      resetState();
      window.location.reload();
    }
  };

  const handleAddBoard = () => {
    if (!config) return;

    const existingIds = config.boards.map(board => {
      const boardInfo = Object.values(board)[0];
      return Number(boardInfo.board_id);
    });
    const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    
    let boardName = `Board${nextId}`;
    let counter = 1;
    while (config.boards.some(board => Object.keys(board)[0] === boardName)) {
      boardName = `Board${nextId}_${counter++}`;
    }
    
    addBoard(boardName, {
      board_id: nextId,
      board_ip: '192.168.1.100',
      packets: [],
      measurements: [],
    });

    onSelectedSection(boardName);
  };

  if (!config) {
    return null;
  }

  const displayError = localError || error;

  return (
    <section className="bg-blue-900 shadow-lg flex h-full w-64 flex-col gap-4 p-4">
      {displayError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm">
          {displayError}
        </div>
      )}

      {saveSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded text-sm">
          Configuration saved successfully!
        </div>
      )}

      <div className="flex gap-2 justify-end">
        <button
          className={`flex items-center justify-center w-10 h-10 rounded-full text-white transition-colors ${
            isLoading 
              ? 'bg-gray-500 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 cursor-pointer'
          }`}
          onClick={handleSave}
          disabled={isLoading}
          title="Save Configuration"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <i className="fa-solid fa-floppy-disk text-lg"></i>
          )}
        </button>
        
        <button
          className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-600 hover:bg-orange-700 text-white cursor-pointer transition-colors"
          onClick={handleReset}
          title="Reset Application"
        >
          <i className="fa-solid fa-gear text-lg"></i>
        </button>
      </div>

      <Button
        title="General Info"
        isSelected={selectedSection === 'general_info'}
        onClick={() => onSelectedSection('general_info')}
      />

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Boards</h2>
          <button
            className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-600 hover:bg-orange-700 text-white cursor-pointer transition-colors"
            onClick={handleAddBoard}
            title="Add New Board"
          >
            <i className="fa-solid fa-plus text-sm"></i>
          </button>
        </div>
        
        <hr className="border-blue-700 mb-4" />

        <ul className="flex flex-col gap-2">
          {config.boards.map((board, index) => {
            const boardName = Object.keys(board)[0];
            const boardInfo = Object.values(board)[0];
            
            return (
              <li key={index}>
                <Button
                  title={
                    <div className="text-left">
                      <div className="font-medium">{boardName}</div>
                      <div className="text-xs opacity-75">ID: {boardInfo.board_id}</div>
                    </div>
                  }
                  isSelected={selectedSection === boardName}
                  onClick={() => onSelectedSection(boardName)}
                />
              </li>
            );
          })}
        </ul>

        {config.boards.length === 0 && (
          <div className="text-white/60 text-sm text-center py-4">
            No boards configured. Click + to add one.
          </div>
        )}
      </div>
    </section>
  );
};