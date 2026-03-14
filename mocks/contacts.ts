export interface ContactSeed {
  name: string
  email: string
  phone: string
  role: string
  projectIndex: number
}

export const defaultContacts: ContactSeed[] = [
  { name: 'Carlos Silva', email: 'carlos@empresa.com', phone: '(11) 99999-0001', role: 'CEO', projectIndex: 0 },
  { name: 'Ana Souza', email: 'ana@empresa.com', phone: '(11) 99999-0002', role: 'Gerente de Projetos', projectIndex: 0 },
  { name: 'Pedro Oliveira', email: 'pedro@restaurante.com', phone: '(21) 99999-0003', role: 'Dono', projectIndex: 1 },
  { name: 'Julia Santos', email: 'julia@modabr.com', phone: '(31) 99999-0004', role: 'Diretora de Marketing', projectIndex: 2 },
  { name: 'Ricardo Lima', email: 'ricardo@modabr.com', phone: '(31) 99999-0005', role: 'Desenvolvedor Frontend', projectIndex: 2 },
  { name: 'Fernanda Costa', email: 'fernanda@saas.io', phone: '(41) 99999-0006', role: 'Product Owner', projectIndex: 3 },
  { name: 'Bruno Almeida', email: 'bruno@startup.com', phone: '(11) 99999-0007', role: 'CTO', projectIndex: 5 },
  { name: 'Mariana Rocha', email: 'mariana@clinica.com', phone: '(51) 99999-0008', role: 'Administradora', projectIndex: 6 },
  { name: 'Lucas Ferreira', email: 'lucas@edtech.com', phone: '(61) 99999-0009', role: 'CEO', projectIndex: 7 },
  { name: 'Camila Mendes', email: 'camila@edtech.com', phone: '(61) 99999-0010', role: 'Designer UX', projectIndex: 7 },
]
