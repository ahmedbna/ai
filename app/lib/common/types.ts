import type { ToolCallUnion } from 'ai';
import type { npmInstallToolParameters } from 'bna-agent/tools/npmInstall';
import type { editToolParameters } from 'bna-agent/tools/edit';
import type { addEnvironmentVariablesParameters } from 'bna-agent/tools/addEnvironmentVariables';
import type { viewParameters } from 'bna-agent/tools/view';
import type { ActionStatus } from '@/lib/runtime/action-runner';
import type { lookupDocsParameters } from 'bna-agent/tools/lookupDocs';
import type { ConvexToolSet, EmptyArgs } from 'bna-agent/types';
import type { getConvexDeploymentNameParameters } from 'bna-agent/tools/getConvexDeploymentName';

type ConvexToolCall = ToolCallUnion<ConvexToolSet>;

export type ConvexToolName = keyof ConvexToolSet;

type ConvexToolResult =
  | {
      toolName: 'deploy';
      args?: EmptyArgs;
      result?: string;
    }
  | {
      toolName: 'view';
      args: typeof viewParameters;
      result: string;
    }
  | {
      toolName: 'npmInstall';
      args: typeof npmInstallToolParameters;
      result: string;
    }
  | {
      toolName: 'edit';
      args: typeof editToolParameters;
      result: string;
    }
  | {
      toolName: 'lookupDocs';
      args: typeof lookupDocsParameters;
      result: string;
    }
  | {
      toolName: 'addEnvironmentVariables';
      args: typeof addEnvironmentVariablesParameters;
      result: string;
    }
  | {
      toolName: 'getConvexDeploymentName';
      args: typeof getConvexDeploymentNameParameters;
      result: string;
    };

export type ConvexToolInvocation =
  | ({
      state: 'partial-call';
      step?: number;
    } & ConvexToolCall)
  | ({
      state: 'call';
      step?: number;
    } & ConvexToolCall)
  | ({
      state: 'result';
      step?: number;
    } & ConvexToolResult);

export type ToolStatus = Record<string, ActionStatus>;
