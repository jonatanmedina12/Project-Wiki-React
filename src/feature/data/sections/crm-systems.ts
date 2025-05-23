// src/data/sections/crm-systems.ts
import type { Seccion } from '../../types';

/**
 * Datos de sistemas CRM y plataformas
 * Organizado por subsecciones para mejor navegación
 */
export const crmSystemsData: Seccion = {
  id: 'crm-systems',
  titulo: 'Sistemas CRM y Plataformas',
  descripcion: 'Guía completa de las principales plataformas CRM del mercado',
  icono: '🏢',
  subtemas: [
    {
      id: 'enterprise-crm',
      titulo: 'CRM Empresariales',
      icono: '🏛️',
      items: [
        {
          subtitulo: 'Salesforce - Enterprise CRM',
          texto: 'Plataforma CRM líder mundial con capacidades empresariales avanzadas y ecosistema AppExchange.',
          items: [
            'Ventajas: Altamente personalizable, gran ecosistema, Einstein AI integrado',
            'Desventajas: Costo elevado, curva de aprendizaje pronunciada',
            'Pricing: Desde $25/usuario/mes hasta $300/usuario/mes',
            'APIs: REST, SOAP, Bulk, Streaming, GraphQL disponibles'
          ],
          codigo: `// Salesforce Integration Service
import jsforce from 'jsforce';

export class SalesforceService {
  private connection: jsforce.Connection;
  
  constructor(private config: SalesforceConfig) {
    this.connection = new jsforce.Connection({
      oauth2: {
        clientId: config.clientId,
        clientSecret: config.clientSecret,
        redirectUri: config.redirectUri
      }
    });
  }
  
  /**
   * Autentica la conexión con Salesforce
   * @throws {Error} Si la autenticación falla
   */
  async authenticate(): Promise<void> {
    await this.connection.login(
      this.config.username,
      this.config.password + this.config.securityToken
    );
  }
  
  /**
   * Crea un nuevo lead en Salesforce
   * @param leadData - Datos del lead a crear
   * @returns ID del lead creado
   */
  async createLead(leadData: LeadData): Promise<string> {
    const result = await this.connection.sobject('Lead').create({
      FirstName: leadData.firstName,
      LastName: leadData.lastName,
      Email: leadData.email,
      Company: leadData.company,
      Status: 'New',
      LeadSource: leadData.source
    });
    
    if (!result.success) {
      throw new Error(\`Failed to create lead: \${result.errors?.join(', ')}\`);
    }
    
    return result.id;
  }
  
  /**
   * Actualiza una oportunidad existente
   * @param id - ID de la oportunidad
   * @param data - Datos a actualizar
   */
  async updateOpportunity(id: string, data: OpportunityUpdate): Promise<void> {
    await this.connection.sobject('Opportunity').update({
      Id: id,
      StageName: data.stage,
      Amount: data.amount,
      CloseDate: data.closeDate
    });
  }
}`,
          lenguaje: 'typescript',
          imagen: 'https://via.placeholder.com/800x400?text=Salesforce+Architecture',
          descripcionImagen: 'Arquitectura de Salesforce con componentes principales'
        },
        {
          subtitulo: 'Microsoft Dynamics 365',
          texto: 'Solución CRM integrada con el ecosistema Microsoft, ideal para empresas que ya usan Office 365.',
          items: [
            'Ventajas: Integración nativa con Office, Power Platform incluida',
            'Desventajas: Complejidad de licenciamiento, requiere expertise Microsoft',
            'Pricing: Desde $65/usuario/mes',
            'Integraciones: Azure, Teams, SharePoint, Power BI'
          ]
        }
      ]
    },
    {
      id: 'mid-market-crm',
      titulo: 'CRM para PYMEs',
      icono: '🏪',
      items: [
        {
          subtitulo: 'HubSpot - Inbound Marketing CRM',
          texto: 'CRM gratuito con potentes herramientas de marketing automation y análisis.',
          items: [
            'Ventajas: Versión gratuita robusta, interfaz intuitiva, marketing integrado',
            'Desventajas: Limitaciones en reporting avanzado gratuito',
            'Ideal para: Startups, PYMEs, empresas enfocadas en inbound',
            'Hubs: Marketing, Sales, Service, CMS integrados'
          ],
          codigo: `// HubSpot Integration Service
import { Client } from '@hubspot/api-client';

export class HubSpotService {
  private client: Client;
  
  constructor(accessToken: string) {
    this.client = new Client({ accessToken });
  }
  
  /**
   * Crea un nuevo contacto en HubSpot
   * @param contactData - Datos del contacto
   * @returns ID del contacto creado
   */
  async createContact(contactData: ContactData): Promise<string> {
    const properties = {
      email: contactData.email,
      firstname: contactData.firstName,
      lastname: contactData.lastName,
      phone: contactData.phone,
      company: contactData.company,
      lifecyclestage: 'lead'
    };
    
    try {
      const response = await this.client.crm.contacts.basicApi.create({
        properties,
        associations: []
      });
      
      return response.id;
    } catch (error) {
      console.error('Error creating HubSpot contact:', error);
      throw error;
    }
  }
  
  /**
   * Crea un nuevo deal en HubSpot
   * @param dealData - Datos del deal
   * @returns ID del deal creado
   */
  async createDeal(dealData: DealData): Promise<string> {
    const properties = {
      dealname: dealData.name,
      amount: dealData.amount.toString(),
      dealstage: dealData.stage,
      pipeline: dealData.pipeline,
      closedate: dealData.closeDate
    };
    
    const response = await this.client.crm.deals.basicApi.create({
      properties
    });
    
    return response.id;
  }
  
  /**
   * Obtiene contactos en lote
   * @param limit - Número máximo de contactos
   * @returns Array de contactos
   */
  async getBatchContacts(limit: number = 100): Promise<Contact[]> {
    const response = await this.client.crm.contacts.basicApi.getPage(
      limit,
      undefined,
      ['firstname', 'lastname', 'email', 'phone', 'company']
    );
    
    return response.results.map(this.mapHubSpotContact);
  }
  
  /**
   * Mapea un contacto de HubSpot al modelo interno
   */
  private mapHubSpotContact(hsContact: any): Contact {
    return {
      id: hsContact.id,
      firstName: hsContact.properties.firstname || '',
      lastName: hsContact.properties.lastname || '',
      email: hsContact.properties.email || '',
      phone: hsContact.properties.phone || '',
      company: hsContact.properties.company || ''
    };
  }
}`,
          lenguaje: 'typescript',
          imagen: 'https://via.placeholder.com/800x400?text=HubSpot+Ecosystem',
          descripcionImagen: 'Ecosistema integrado de HubSpot'
        },
        {
          subtitulo: 'Pipedrive - Sales-focused CRM',
          texto: 'CRM diseñado específicamente para equipos de ventas, con pipeline visual intuitivo.',
          items: [
            'Ventajas: Pipeline visual excelente, fácil adopción',
            'Desventajas: Marketing automation limitado',
            'Pricing: Desde $14.90/usuario/mes',
            'Mejor para: Equipos de ventas B2B'
          ]
        }
      ]
    },
    {
      id: 'specialized-crm',
      titulo: 'CRM Especializados',
      icono: '🎯',
      items: [
        {
          subtitulo: 'Zendesk - Service CRM',
          texto: 'CRM especializado en servicio al cliente y soporte técnico.',
          items: [
            'Ventajas: Ticketing system robusto, omnichannel support',
            'Desventajas: No ideal para ventas tradicionales',
            'Integraciones: 1000+ apps disponibles',
            'Canales: Email, chat, voz, redes sociales'
          ]
        },
        {
          subtitulo: 'Monday.com CRM',
          texto: 'CRM basado en la plataforma de gestión de trabajo Monday.com.',
          items: [
            'Ventajas: Altamente visual y personalizable',
            'Desventajas: Funcionalidades CRM son un add-on',
            'Ideal para: Equipos que ya usan Monday.com',
            'Automatizaciones: No-code workflow builder'
          ]
        }
      ]
    }
  ]
};