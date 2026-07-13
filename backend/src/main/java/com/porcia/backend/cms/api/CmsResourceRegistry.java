package com.porcia.backend.cms.api;

import com.porcia.backend.cms.dto.BannersDtos;
import com.porcia.backend.cms.dto.BlogsDtos;
import com.porcia.backend.cms.dto.FaqCategoriesDtos;
import com.porcia.backend.cms.dto.FaqDtos;
import com.porcia.backend.cms.dto.HomeSectionsDtos;
import com.porcia.backend.cms.dto.LookbooksDtos;
import com.porcia.backend.cms.dto.MediaDtos;
import com.porcia.backend.cms.dto.PagesDtos;
import com.porcia.backend.cms.dto.SectionsDtos;
import com.porcia.backend.cms.dto.TestimonialsDtos;
import com.porcia.backend.cms.mapper.BannersMapper;
import com.porcia.backend.cms.mapper.BlogsMapper;
import com.porcia.backend.cms.mapper.FaqCategoriesMapper;
import com.porcia.backend.cms.mapper.FaqMapper;
import com.porcia.backend.cms.mapper.HomeSectionsMapper;
import com.porcia.backend.cms.mapper.LookbooksMapper;
import com.porcia.backend.cms.mapper.MediaMapper;
import com.porcia.backend.cms.mapper.PagesMapper;
import com.porcia.backend.cms.mapper.SectionsMapper;
import com.porcia.backend.cms.mapper.TestimonialsMapper;
import com.porcia.backend.cms.persistence.BannersEntity;
import com.porcia.backend.product.dto.BrandDtos;
import com.porcia.backend.product.dto.CategoryDtos;
import com.porcia.backend.product.dto.CollectionDtos;
import com.porcia.backend.product.dto.ProductDtos;
import com.porcia.backend.product.mapper.BrandMapper;
import com.porcia.backend.product.mapper.CategoryMapper;
import com.porcia.backend.product.mapper.CollectionMapper;
import com.porcia.backend.product.mapper.ProductMapper;
import com.porcia.backend.product.persistence.BrandEntity;
import com.porcia.backend.product.persistence.ProductEntity;
import com.porcia.backend.product.persistence.CategoryEntity;
import com.porcia.backend.product.persistence.CollectionEntity;
import com.porcia.backend.cms.persistence.BannersRepository;
import com.porcia.backend.cms.persistence.BlogsEntity;
import com.porcia.backend.cms.persistence.BlogsRepository;
import com.porcia.backend.cms.persistence.FaqCategoriesRepository;
import com.porcia.backend.cms.persistence.FaqCategoryEntity;
import com.porcia.backend.cms.persistence.FaqEntities;
import com.porcia.backend.cms.persistence.FaqRepository;
import com.porcia.backend.cms.persistence.HomeSectionsEntity;
import com.porcia.backend.cms.persistence.HomeSectionsRepository;
import com.porcia.backend.cms.persistence.LookbooksEntity;
import com.porcia.backend.cms.persistence.LookbooksRepository;
import com.porcia.backend.cms.persistence.MediaEntity;
import com.porcia.backend.cms.persistence.MediaRepository;
import com.porcia.backend.cms.persistence.PagesEntity;
import com.porcia.backend.cms.persistence.PagesRepository;
import com.porcia.backend.cms.persistence.SectionsEntity;
import com.porcia.backend.cms.persistence.SectionsRepository;
import com.porcia.backend.cms.persistence.TestimonialsEntity;
import com.porcia.backend.cms.persistence.TestimonialsRepository;
import com.porcia.backend.product.persistence.BrandRepository;
import com.porcia.backend.product.persistence.CategoryRepository;
import com.porcia.backend.product.persistence.CollectionRepository;
import com.porcia.backend.product.persistence.ProductRepository;
import com.porcia.backend.common.api.PageResponse;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.function.BiConsumer;
import java.util.function.Function;

@Component
public class CmsResourceRegistry {

    public interface ResourceAdapter {
        Class<?> createType();
        Class<?> updateType();
        PageResponse<Object> list(int page, int size);
        Object get(Long id);
        Object create(Object request);
        Object update(Long id, Object request);
        void delete(Long id);
    }

    private final Map<CmsResource, ResourceAdapter> adapters = new EnumMap<>(CmsResource.class);

    public CmsResourceRegistry(
            PagesRepository pagesRepository,
            SectionsRepository sectionsRepository,
            ProductRepository productRepository,
            BannersRepository bannersRepository,
            HomeSectionsRepository homeSectionsRepository,
            FaqRepository faqRepository,
            TestimonialsRepository testimonialsRepository,
            BlogsRepository blogsRepository,
            MediaRepository mediaRepository,
            LookbooksRepository lookbooksRepository,
            CategoryRepository categoryRepository,
            BrandRepository brandRepository,
            CollectionRepository collectionRepository,
            FaqCategoriesRepository faqCategoriesRepository,
            PagesMapper pagesMapper,
            ProductMapper productMapper,
            SectionsMapper sectionsMapper,
            BannersMapper bannersMapper,
            HomeSectionsMapper homeSectionsMapper,
            FaqMapper faqMapper,
            TestimonialsMapper testimonialsMapper,
            BlogsMapper blogsMapper,
            MediaMapper mediaMapper,
            LookbooksMapper lookbooksMapper,
            CategoryMapper categoryMapper,
            BrandMapper brandMapper,
            CollectionMapper collectionMapper,
            FaqCategoriesMapper faqCategoriesMapper
    ) {
        adapters.put(CmsResource.pages, simple(
                PagesDtos.CreatePageRequest.class,
                PagesDtos.UpdatePageRequest.class,
                pagesRepository,
                pagesMapper::toEntity,
                pagesMapper::toEntity,
                pagesMapper::toResponse,
                PagesEntity.class,
                (existing, incoming) -> {
                    copyProperties(incoming, existing);
                    if (existing.getIsDeleted() == null) {
                        existing.setIsDeleted(Boolean.FALSE);
                    }
                },
                entity -> {
                    entity.setIsDeleted(Boolean.TRUE);
                    pagesRepository.save(entity);
                }
        ));
        adapters.put(CmsResource.sections, simple(
                SectionsDtos.CreateSectionRequest.class,
                SectionsDtos.UpdateSectionRequest.class,
                sectionsRepository,
                sectionsMapper::toEntity,
                sectionsMapper::toEntity,
                sectionsMapper::toResponse,
                SectionsEntity.class,
                CmsResourceRegistry::copyProperties,
                null
        ));
        adapters.put(CmsResource.banners, simple(
                BannersDtos.CreateBannerRequest.class,
                BannersDtos.UpdateBannerRequest.class,
                bannersRepository,
                bannersMapper::toEntity,
                bannersMapper::toEntity,
                bannersMapper::toResponse,
                BannersEntity.class,
                CmsResourceRegistry::copyProperties,
                null
        ));
        adapters.put(CmsResource.home_sections, simple(
                HomeSectionsDtos.CreateHomeSectionRequest.class,
                HomeSectionsDtos.UpdateHomeSectionRequest.class,
                homeSectionsRepository,
                homeSectionsMapper::toEntity,
                homeSectionsMapper::toEntity,
                homeSectionsMapper::toResponse,
                HomeSectionsEntity.class,
                CmsResourceRegistry::copyProperties,
                null
        ));
        adapters.put(CmsResource.faqs, simple(
                FaqDtos.CreateFaqRequest.class,
                FaqDtos.UpdateFaqRequest.class,
                faqRepository,
                faqMapper::toEntity,
                faqMapper::toEntity,
                faqMapper::toResponse,
                FaqEntities.class,
                CmsResourceRegistry::copyProperties,
                null
        ));
        adapters.put(CmsResource.testimonials, simple(
                TestimonialsDtos.CreateTestimonialRequest.class,
                TestimonialsDtos.UpdateTestimonialRequest.class,
                testimonialsRepository,
                testimonialsMapper::toEntity,
                testimonialsMapper::toEntity,
                testimonialsMapper::toResponse,
                TestimonialsEntity.class,
                CmsResourceRegistry::copyProperties,
                null
        ));
        adapters.put(CmsResource.blogs, simple(
                BlogsDtos.CreateBlogRequest.class,
                BlogsDtos.UpdateBlogRequest.class,
                blogsRepository,
                blogsMapper::toEntity,
                blogsMapper::toEntity,
                blogsMapper::toResponse,
                BlogsEntity.class,
                CmsResourceRegistry::copyProperties,
                null
        ));
        adapters.put(CmsResource.media, simple(
                MediaDtos.CreateMediaRequest.class,
                MediaDtos.UpdateMediaRequest.class,
                mediaRepository,
                mediaMapper::toEntity,
                mediaMapper::toEntity,
                mediaMapper::toResponse,
                MediaEntity.class,
                CmsResourceRegistry::copyProperties,
                null
        ));
        adapters.put(CmsResource.lookbooks, simple(
                LookbooksDtos.CreateLookbookRequest.class,
                LookbooksDtos.UpdateLookbookRequest.class,
                lookbooksRepository,
                lookbooksMapper::toEntity,
                lookbooksMapper::toEntity,
                lookbooksMapper::toResponse,
                LookbooksEntity.class,
                CmsResourceRegistry::copyProperties,
                null
        ));
        adapters.put(CmsResource.faq_categories, simple(
                FaqCategoriesDtos.CreateFaqCategoryRequest.class,
                FaqCategoriesDtos.UpdateFaqCategoryRequest.class,
                faqCategoriesRepository,
                faqCategoriesMapper::toEntity,
                faqCategoriesMapper::toEntity,
                faqCategoriesMapper::toResponse,
                FaqCategoryEntity.class,
                CmsResourceRegistry::copyProperties,
                null
        ));
        adapters.put(CmsResource.products, new ResourceAdapter() {
            private ProductEntity findProduct(Long id) {
                return productRepository.findById(id)
                        .orElseThrow(() -> new NoSuchElementException("ProductEntity not found: " + id));
            }

            @Override
            public Class<?> createType() { return ProductDtos.CreateProductRequest.class; }

            @Override
            public Class<?> updateType() { return ProductDtos.UpdateProductRequest.class; }

            @Override
            public PageResponse<Object> list(int page, int size) {
                Page<ProductEntity> result = productRepository.findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id")));
                return new PageResponse<>(
                        result.getContent().stream().map(productMapper::toResponse).map(Object.class::cast).toList(),
                        result.getNumber(),
                        result.getSize(),
                        result.getTotalElements(),
                        result.getTotalPages()
                );
            }

            @Override
            public Object get(Long id) {
                return productMapper.toResponse(findProduct(id));
            }

            @Override
            public Object create(Object request) {
                ProductEntity entity = productMapper.toEntity((ProductDtos.CreateProductRequest) request);
                return productMapper.toResponse(productRepository.save(entity));
            }

            @Override
            public Object update(Long id, Object request) {
                ProductEntity existing = findProduct(id);
                productMapper.updateEntityFromRequest((ProductDtos.UpdateProductRequest) request, existing);
                return productMapper.toResponse(productRepository.save(existing));
            }

            @Override
            public void delete(Long id) {
                productRepository.delete(findProduct(id));
            }
        });
        adapters.put(CmsResource.categories, simple(
                CategoryDtos.CreateCategoryRequest.class,
                CategoryDtos.UpdateCategoryRequest.class,
                categoryRepository,
                categoryMapper::toEntity,
                categoryMapper::toEntity,
                categoryMapper::toResponse,
                CategoryEntity.class,
                CmsResourceRegistry::copyProperties,
                null
        ));
        adapters.put(CmsResource.brands, simple(
                BrandDtos.CreateBrandRequest.class,
                BrandDtos.UpdateBrandRequest.class,
                brandRepository,
                brandMapper::toEntity,
                brandMapper::toEntity,
                brandMapper::toResponse,
                BrandEntity.class,
                CmsResourceRegistry::copyProperties,
                null
        ));
        adapters.put(CmsResource.collections, simple(
                CollectionDtos.CreateCollectionRequest.class,
                CollectionDtos.UpdateCollectionRequest.class,
                collectionRepository,
                collectionMapper::toEntity,
                collectionMapper::toEntity,
                collectionMapper::toResponse,
                CollectionEntity.class,
                CmsResourceRegistry::copyProperties,
                null
        ));
    }

    public ResourceAdapter adapter(CmsResource resource) {
        return Optional.ofNullable(adapters.get(resource))
                .orElseThrow(() -> new NoSuchElementException("CMS resource not registered: " + resource));
    }

    private static <C, U, E, R> ResourceAdapter simple(
            Class<C> createType,
            Class<U> updateType,
            JpaRepository<E, Long> repository,
            Function<C, E> createMapper,
            Function<U, E> updateMapper,
            Function<E, R> responseMapper,
            Class<E> entityType,
            BiConsumer<E, E> updater,
            java.util.function.Consumer<E> softDelete
    ) {
        return new SimpleAdapter<>(
                createType,
                updateType,
                repository,
                createMapper,
                updateMapper,
                responseMapper,
                entityType,
                updater,
                softDelete
        );
    }

    private static <E> void copyProperties(E source, E target) {
        BeanUtils.copyProperties(source, target, "id");
    }

    private record SimpleAdapter<C, U, E, R>(
            Class<C> createType,
            Class<U> updateType,
            JpaRepository<E, Long> repository,
            Function<C, E> createMapper,
            Function<U, E> updateMapper,
            Function<E, R> responseMapper,
            Class<E> entityType,
            BiConsumer<E, E> updater,
            java.util.function.Consumer<E> softDelete
    ) implements ResourceAdapter {

        @Override
        public PageResponse<Object> list(int page, int size) {
            Page<E> result = repository.findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id")));
            return new PageResponse<>(
                    result.getContent().stream().map(entity -> (Object) responseMapper.apply(entity)).toList(),
                    result.getNumber(),
                    result.getSize(),
                    result.getTotalElements(),
                    result.getTotalPages()
            );
        }

        @Override
        public Object get(Long id) {
            return responseMapper.apply(find(id));
        }

        @Override
        public Object create(Object request) {
            E entity = createMapper.apply(createType.cast(request));
            return responseMapper.apply(repository.save(entity));
        }

        @Override
        public Object update(Long id, Object request) {
            E existing = find(id);
            E incoming = updateMapper.apply(updateType.cast(request));
            updater.accept(existing, incoming);
            return responseMapper.apply(repository.save(existing));
        }

        @Override
        public void delete(Long id) {
            E entity = find(id);
            if (softDelete != null) {
                softDelete.accept(entity);
                return;
            }
            repository.delete(entity);
        }

        private E find(Long id) {
            return repository.findById(id)
                    .orElseThrow(() -> new NoSuchElementException(entityType.getSimpleName() + " not found: " + id));
        }
    }
}
