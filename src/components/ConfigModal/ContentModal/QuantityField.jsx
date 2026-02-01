import { Bot, FileText } from "lucide-react";

export function QuantityField({ value, onChange }) {
  return (
    <>
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
          <FileText className="w-4 h-4 text-primary-500" />
          Quantidade de Imagens
        </label>
        <input
          type="number"
          min="1"
          max="100"
          value={value.quantidade}
          onChange={(e) =>
            onChange("quantidade", parseInt(e.target.value) || 1)
          }
          className="input-field w-32"
        />
      </div>
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
          <Bot className="w-4 h-4 text-primary-500" />
          Lista com Modelo de IA (Disponiveis)
        </label>
        <div className="p-4 bg-dark-100 border mb-2 border-gray-700 rounded-lg text-sm text-gray-400 max-h-40 overflow-y-auto">
          <table border="1" className="w-full  ">
            <thead className=" p-4 border mb-2 border-gray-700 rounded-lg">
              <tr>
                <th>Modelos</th>
                <th>Imagem (1024×1024)</th>
                <th>Melhor para</th>
              </tr>
            </thead>
            <tbody className="text-center">
              <tr>
                <td>gpt-4o-mini</td>
                <td>$0.0035</td>
                <td>Melhor custo-benefício para manuscrito comum</td>
              </tr>
              <tr>
                <td>gpt-4o</td>
                <td>$0.01 - $0.08</td>
                <td>Alta precisao para manuscrito difícil/antigo</td>
              </tr>
              <tr>
                <td>gpt-4-turbo</td>
                <td>$0.04 - $0.012</td>
                <td>Tarefas complexas</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex gap-4">
          <select
            id="modelo-ia"
            name="modelo-ia"
            className="input-field w-64 mt-2"
            value={value.modelo}
            onChange={(e) => onChange("modelo", e.target.value)}
          >
            <option value="gpt-4o-mini">gpt-4o-mini</option>
            <option value="gpt-4o">gpt-4o</option>
            <option value="gpt-4-turbo">gpt-4-turbo</option>
          </select>
          <select
            id="qualidade-ia"
            name="qualidade-ia"
            className="input-field w-64 mt-2"
            value={value.qualidade}
            onChange={(e) => onChange("qualidade", e.target.value)}
          >
            <option value="low">low</option>
            <option value="high">high</option>
            <option value="auto">auto</option>
          </select>
        </div>
      </div>
    </>
  );
}
