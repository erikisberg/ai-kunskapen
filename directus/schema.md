# Directus Collection Setup

Create these collections manually in the Directus admin UI (localhost:8055) before running the seed script.

## Collections

### tenants
| Field | Type | Notes |
|-------|------|-------|
| id | uuid (auto) | Primary key |
| name | string | Required |
| slug | string | Required, unique |
| logo | file (image) | Optional |
| primary_color | string | Default: #7546FF |
| secondary_color | string | Default: #F8FE22 |
| footer_text | text | Required |
| domain | string | Optional (for future multi-tenant) |

### courses
| Field | Type | Notes |
|-------|------|-------|
| id | uuid (auto) | Primary key |
| tenant_id | M2O → tenants | Required |
| title | string | Required |
| slug | string | Required |
| description | text | Required |
| accent_color | string | Required |
| illustration | file (image) | Optional |
| sort_order | integer | Required |

### modules
| Field | Type | Notes |
|-------|------|-------|
| id | uuid (auto) | Primary key |
| course_id | M2O → courses | Required |
| title | string | Required |
| slug | string | Required |
| description | text | Required |
| sort_order | integer | Required |
| estimated_minutes | integer | Required |

### slides
| Field | Type | Notes |
|-------|------|-------|
| id | uuid (auto) | Primary key |
| module_id | M2O → modules | Required |
| sort_order | integer | Required |
| type | dropdown | Values: intro, info, llm_chat, quiz, scenario, checklist, complete |
| heading | string | Required |
| body_text | text (markdown) | Required |
| illustration | file (image) | Optional |
| llm_system_prompt | text | Optional (only for llm_chat type) |
| llm_instruction_text | text | Optional (only for llm_chat type) |
| llm_max_messages | integer | Optional, default 10 |

### quiz_options
| Field | Type | Notes |
|-------|------|-------|
| id | uuid (auto) | Primary key |
| slide_id | M2O → slides | Required |
| option_text | string | Required |
| is_correct | boolean | Required |
| feedback_text | text | Required |
| sort_order | integer | Required |

### scenario_choices
| Field | Type | Notes |
|-------|------|-------|
| id | uuid (auto) | Primary key |
| slide_id | M2O → slides | Required |
| choice_text | string | Required |
| outcome_text | text | Required |
| is_recommended | boolean | Required |
| sort_order | integer | Required |

### checklist_items
| Field | Type | Notes |
|-------|------|-------|
| id | uuid (auto) | Primary key |
| slide_id | M2O → slides | Required |
| item_text | string | Required |
| sort_order | integer | Required |

## API Access

1. Go to Settings → Access Policies
2. Create a static token for API access
3. Give the token read access to all collections above
4. Use the token as DIRECTUS_TOKEN in .env.local
