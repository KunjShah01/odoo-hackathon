import React, { useState } from 'react';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useExpenseStore } from '../store/useExpenseStore';
import { Settings, Users, Workflow, Plus, Trash2 } from 'lucide-react';
import { ApprovalFlow, ApprovalStep } from '../types';

const MOCK_USERS = [
  { id: '1', name: 'John Employee', role: 'employee' },
  { id: '2', name: 'Sarah Manager', role: 'manager' },
  { id: '3', name: 'Alex Admin', role: 'admin' },
  { id: '4', name: 'Mike CFO', role: 'manager' }
];

export function AdminPanel() {
  const { flows, saveFlows } = useExpenseStore();
  const [activeTab, setActiveTab] = useState<'flows' | 'users'>('flows');
  const [isFlowModalOpen, setIsFlowModalOpen] = useState(false);
  const [editingFlow, setEditingFlow] = useState<ApprovalFlow | null>(null);

  const [flowForm, setFlowForm] = useState<{ name: string; steps: ApprovalStep[] }>({
    name: '',
    steps: [
      {
        stepNumber: 1,
        name: '',
        approverIds: [] as string[],
        approvalType: 'specific'
      } as ApprovalStep
    ]
  });

  const openNewFlow = () => {
    setFlowForm({
      name: '',
      steps: [
        {
          stepNumber: 1,
          name: '',
          approverIds: [],
          approvalType: 'specific'
        }
      ]
    });
    setEditingFlow(null);
    setIsFlowModalOpen(true);
  };

  const addStep = () => {
    setFlowForm({
      ...flowForm,
      steps: [
        ...flowForm.steps,
        {
          stepNumber: flowForm.steps.length + 1,
          name: '',
          approverIds: [],
          approvalType: 'specific'
        }
      ]
    });
  };

  const removeStep = (stepNumber: number) => {
    setFlowForm({
      ...flowForm,
      steps: flowForm.steps.filter(s => s.stepNumber !== stepNumber)
        .map((s, idx) => ({ ...s, stepNumber: idx + 1 }))
    });
  };

  const updateStep = (stepNumber: number, updates: Partial<ApprovalStep>) => {
    setFlowForm({
      ...flowForm,
      steps: flowForm.steps.map(s =>
        s.stepNumber === stepNumber ? { ...s, ...updates } : s
      )
    });
  };

  const saveFlow = () => {
    const newFlow: ApprovalFlow = {
      id: editingFlow?.id || Date.now().toString(),
      name: flowForm.name,
      steps: flowForm.steps,
      isActive: true,
      createdBy: '3',
      createdAt: editingFlow?.createdAt || new Date().toISOString()
    };

    if (editingFlow) {
      saveFlows(flows.map(f => f.id === editingFlow.id ? newFlow : f));
    } else {
      saveFlows([...flows, newFlow]);
    }

    setIsFlowModalOpen(false);
  };

  const deleteFlow = (flowId: string) => {
    if (confirm('Are you sure you want to delete this approval flow?')) {
      saveFlows(flows.filter(f => f.id !== flowId));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
        <p className="text-slate-600 mt-1">Manage approval flows and system settings</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('flows')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'flows'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Workflow size={20} />
            Approval Flows
          </div>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'users'
              ? 'text-teal-600 border-b-2 border-teal-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Users size={20} />
            User Management
          </div>
        </button>
      </div>

      {activeTab === 'flows' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-900">Approval Flows</h2>
            <Button onClick={openNewFlow} className="flex items-center gap-2">
              <Plus size={20} />
              Create Flow
            </Button>
          </div>

          <div className="grid gap-4">
            {flows.map(flow => (
              <Card key={flow.id}>
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-slate-900">{flow.name}</h3>
                        {flow.isActive && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            Active
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        {flow.steps.map((step, idx) => (
                          <React.Fragment key={step.stepNumber}>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold text-sm">
                                {step.stepNumber}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-900">{step.name}</p>
                                <p className="text-xs text-slate-500">
                                  {step.approvalType === 'specific' ? 'Specific Approver' :
                                   step.approvalType === 'percentage' ? `${step.percentageRequired}% Required` :
                                   'All Required'}
                                </p>
                              </div>
                            </div>
                            {idx < flow.steps.length - 1 && (
                              <div className="w-8 h-0.5 bg-slate-300" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setEditingFlow(flow);
                          setFlowForm({
                            name: flow.name,
                            steps: flow.steps
                          });
                          setIsFlowModalOpen(true);
                        }}
                      >
                        <Settings size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteFlow(flow.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-slate-900">Users</h2>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-y border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {MOCK_USERS.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700 capitalize">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button size="sm" variant="secondary">
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        isOpen={isFlowModalOpen}
        onClose={() => setIsFlowModalOpen(false)}
        title={editingFlow ? 'Edit Approval Flow' : 'Create Approval Flow'}
        size="lg"
      >
        <div className="p-6 space-y-6">
          <Input
            label="Flow Name"
            value={flowForm.name}
            onChange={(e) => setFlowForm({ ...flowForm, name: e.target.value })}
            placeholder="e.g., Standard Approval Flow"
            required
          />

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Approval Steps</h3>
              <Button size="sm" onClick={addStep} className="flex items-center gap-1">
                <Plus size={16} />
                Add Step
              </Button>
            </div>

            <div className="space-y-4">
              {flowForm.steps.map(step => (
                <Card key={step.stepNumber}>
                  <CardBody>
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                        {step.stepNumber}
                      </div>

                      <div className="flex-1 space-y-3">
                        <Input
                          label="Step Name"
                          value={step.name}
                          onChange={(e) => updateStep(step.stepNumber, { name: e.target.value })}
                          placeholder="e.g., Manager Review"
                        />

                        <Select
                          label="Approval Type"
                          value={step.approvalType}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateStep(step.stepNumber, {
                            approvalType: e.target.value as ApprovalStep['approvalType']
                          })}
                        >
                          <option value="specific">Specific Approver</option>
                          <option value="percentage">Percentage Required</option>
                          <option value="all">All Required</option>
                        </Select>

                        <Select
                          label="Approver"
                          value={step.approverIds[0] || ''}
                          onChange={(e) => updateStep(step.stepNumber, {
                            approverIds: [e.target.value]
                          })}
                        >
                          <option value="">Select approver...</option>
                          {MOCK_USERS.filter(u => u.role !== 'employee').map(user => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                          ))}
                        </Select>
                      </div>

                      {flowForm.steps.length > 1 && (
                        <button
                          onClick={() => removeStep(step.stepNumber)}
                          className="text-red-500 hover:text-red-700 mt-8"
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <Button variant="secondary" onClick={() => setIsFlowModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={saveFlow} className="flex-1">
              {editingFlow ? 'Update Flow' : 'Create Flow'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
