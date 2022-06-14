import { AppDispatch, RootState } from ".";
import { AsyncThunk, AsyncThunkOptions, AsyncThunkPayloadCreator, createAsyncThunk as _createAsyncThunk } from '@reduxjs/toolkit'


export type AsyncThunkDefaultConfig = {
  dispatch: AppDispatch;
  state: RootState
}

export function createAsyncThunk<Returned, ThunkArg = void>(typePrefix: string, payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, AsyncThunkDefaultConfig>, options?: AsyncThunkOptions<ThunkArg, AsyncThunkDefaultConfig>): AsyncThunk<Returned, ThunkArg, AsyncThunkDefaultConfig> {
  return _createAsyncThunk<Returned, ThunkArg, AsyncThunkDefaultConfig>(typePrefix, payloadCreator, options);
};