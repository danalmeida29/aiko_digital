import React, { useState } from 'react';
import {
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export const Sidebar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className="w-1/4 h-full bg-gray-800 p-4 text-white fixed">
      <Typography variant="h6" className="mb-4">
        Equipamentos
      </Typography>

      <div className="mb-4 border-none">
        <TextField
          fullWidth
          placeholder="Buscar equipamentos"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
          className="bg-[#FAFAFA] rounded-md justify-center"
        />
      </div>

      <div className="mb-4 border-none">
        <FormControl
          fullWidth
          className="bg-[#FAFAFA] rounded-md justify-center"
        >
          <InputLabel>Selecionar Modelo</InputLabel>
          <Select
            value={selectedOption}
            onChange={handleSelectChange}
            label="Selecionar Modelo"
          >
            <MenuItem value="Modelo 1">Modelo 1</MenuItem>
            <MenuItem value="Modelo 2">Modelo 2</MenuItem>
            <MenuItem value="Modelo 3">Modelo 3</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
};
